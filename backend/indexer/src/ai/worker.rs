use std::time::{Duration, SystemTime, UNIX_EPOCH};

use anyhow::Result;
use diesel::prelude::*;
use diesel_async::RunQueryDsl;
use diesel_async::pooled_connection::bb8::Pool;
use diesel_async::AsyncPgConnection;

use crate::db::schema::{artifact, artifact_ai_meta, artifact_embedding, artifact_file};
use crate::db::models::NewArtifactEmbedding;
use super::extractor;
use super::openrouter::{self, AiClient};

const POLL_INTERVAL_SECS:   u64 = 5;
const STALE_RESET_SECS:     u64 = 60;
const STALE_THRESHOLD_SECS: i64 = 300;
const BATCH_SIZE:            i64 = 5;
const WALRUS_AGGREGATOR: &str = "https://aggregator.walrus-testnet.walrus.space";

const STATUS_PENDING:             &str = "pending";
const STATUS_PROCESSING:          &str = "processing";
#[allow(dead_code)] // used as a SQL string literal in mark_failed
const STATUS_FAILED:              &str = "failed";
#[allow(dead_code)] // used as a SQL string literal in mark_failed
const STATUS_PERMANENTLY_FAILED:  &str = "permanently_failed";
const STATUS_DONE:                &str = "done";

fn now_secs() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64
}

pub struct AiWorker {
    pub pool:        Pool<AsyncPgConnection>,
    pub ai_client:   AiClient,
    pub http_client: reqwest::Client,
}

impl AiWorker {
    pub async fn run(self) {
        let pool = std::sync::Arc::new(self.pool);
        let ai_client = std::sync::Arc::new(self.ai_client);
        let http_client = std::sync::Arc::new(self.http_client);

        // Startup: backfill any artifacts not yet in artifact_ai_meta
        if let Ok(mut conn) = pool.get().await {
            if let Err(e) = backfill(&mut conn).await {
                tracing::warn!("AI backfill failed: {e}");
            }
        }

        // Stale reset loop: requeue items stuck in 'processing' for > STALE_THRESHOLD_SECS
        tokio::spawn({
            let pool = pool.clone();
            async move {
                let mut interval = tokio::time::interval(Duration::from_secs(STALE_RESET_SECS));
                loop {
                    interval.tick().await;
                    if let Ok(mut conn) = pool.get().await {
                        let threshold = now_secs() - STALE_THRESHOLD_SECS;
                        let _ = diesel::update(artifact_ai_meta::table)
                            .filter(artifact_ai_meta::status.eq(STATUS_PROCESSING))
                            .filter(artifact_ai_meta::updated_at.lt(threshold))
                            .set((
                                artifact_ai_meta::status.eq(STATUS_PENDING),
                                artifact_ai_meta::updated_at.eq(now_secs()),
                            ))
                            .execute(&mut conn)
                            .await;
                    }
                }
            }
        });

        // Main poll loop: process artifacts sequentially with 200ms spacing to respect rate limits
        let mut poll_interval = tokio::time::interval(Duration::from_secs(POLL_INTERVAL_SECS));
        loop {
            poll_interval.tick().await;
            let Ok(mut conn) = pool.get().await else { continue };

            // Claim batch: pending OR eligible failed rows
            let ids: Vec<String> = match diesel::sql_query(
                "UPDATE artifact_ai_meta SET status = 'processing', updated_at = $1
                 WHERE artifact_id IN (
                     SELECT artifact_id FROM artifact_ai_meta
                     WHERE status = 'pending'
                        OR (status = 'failed' AND retry_count < 3)
                     ORDER BY created_at ASC
                     LIMIT $2
                     FOR UPDATE SKIP LOCKED
                 )
                 RETURNING artifact_id"
            )
            .bind::<diesel::sql_types::BigInt, _>(now_secs())
            .bind::<diesel::sql_types::BigInt, _>(BATCH_SIZE)
            .load::<ArtifactIdRow>(&mut conn)
            .await {
                Ok(rows) => rows.into_iter().map(|r| r.artifact_id).collect(),
                Err(e) => { tracing::warn!("AI poll query failed: {e}"); continue }
            };

            if ids.is_empty() {
                tracing::debug!("AI poll: no pending artifacts");
                continue;
            }
            tracing::info!(count = ids.len(), "AI poll: claimed batch");

            for (i, id) in ids.into_iter().enumerate() {
                if i > 0 {
                    tokio::time::sleep(Duration::from_millis(200)).await;
                }
                tracing::info!(artifact_id = %id, "AI processing start");
                if let Err(e) = process_one(&pool, &ai_client, &http_client, &id).await {
                    tracing::warn!(artifact_id = %id, "AI pipeline failed: {e}");
                    mark_failed(&pool, &id).await;
                }
            }
        }
    }
}

#[derive(diesel::QueryableByName)]
struct ArtifactIdRow {
    #[diesel(sql_type = diesel::sql_types::Text)]
    artifact_id: String,
}

async fn backfill(conn: &mut AsyncPgConnection) -> Result<()> {
    let now = now_secs();
    let inserted = diesel::sql_query(
        "INSERT INTO artifact_ai_meta (artifact_id, created_at, updated_at)
         SELECT a.sui_object_id, a.created_at / 1000, $1
         FROM artifact a
         LEFT JOIN artifact_ai_meta m ON a.sui_object_id = m.artifact_id
         WHERE m.artifact_id IS NULL"
    )
    .bind::<diesel::sql_types::BigInt, _>(now)
    .execute(conn)
    .await?;
    tracing::info!(inserted, "AI backfill complete");
    Ok(())
}

fn is_multimodal(mime_type: &str) -> bool {
    let mime = mime_type.split(';').next().unwrap_or("").trim();
    // Explicit allowlist of what Gemini 2.0 Flash accepts as inline_data.
    // SVG is excluded — handled by extract_text (text/XML extraction path).
    // ZIP and other binary containers are excluded — Gemini can't read them.
    matches!(mime,
        "application/pdf"
        | "image/jpeg" | "image/jpg" | "image/png" | "image/gif"
        | "image/webp" | "image/heic" | "image/heif"
        | "video/mp4" | "video/mpeg" | "video/quicktime"
        | "video/webm" | "video/x-msvideo" | "video/3gpp"
    )
}

async fn process_one(
    pool:        &Pool<AsyncPgConnection>,
    ai_client:   &AiClient,
    http_client: &reqwest::Client,
    artifact_id: &str,
) -> Result<()> {
    // Phase A: read — hold the connection only for the two cheap DB reads, then return it.
    let (files, title, description) = {
        let mut conn = pool.get().await?;

        // 1. Fetch file references
        let files: Vec<(String, String, i64)> = artifact_file::table
            .filter(artifact_file::artifact_id.eq(artifact_id))
            .select((artifact_file::patch_id, artifact_file::mime_type, artifact_file::size_bytes))
            .load(&mut conn)
            .await?;

        // 2. Fetch artifact title/description for fallback
        let (title, description): (String, String) = artifact::table
            .filter(artifact::sui_object_id.eq(artifact_id))
            .select((artifact::title, artifact::description))
            .first(&mut conn)
            .await?;

        (files, title, description)
        // conn dropped here — pool slot released before any HTTP I/O
    };

    // Phase B: HTTP I/O — no pool connection held.
    // 3. Extract text and collect binary parts from each file
    tracing::info!(artifact_id, files = files.len(), "fetching files from Walrus");
    let mut native_texts: Vec<String> = Vec::new();
    let mut binary_parts: Vec<openrouter::BinaryPart> = Vec::new();

    for (patch_id, mime_type, size_bytes) in &files {
        if extractor::is_too_large(*size_bytes as u64) {
            tracing::warn!(artifact_id, %patch_id, "skipping file > 5MB");
            continue;
        }
        let url = format!("{WALRUS_AGGREGATOR}/v1/blobs/by-quilt-patch-id/{patch_id}");
        tracing::debug!(artifact_id, %patch_id, "fetching blob");
        let Ok(resp) = http_client.get(&url).send().await else {
            tracing::warn!(artifact_id, %patch_id, "Walrus fetch failed");
            continue;
        };
        let Ok(bytes) = resp.bytes().await else {
            tracing::warn!(artifact_id, %patch_id, "Walrus read body failed");
            continue;
        };

        if let Some(text) = extractor::extract_text(&bytes, mime_type) {
            native_texts.push(text);
        } else if is_multimodal(mime_type) {
            // PDF and images: send as inline_data so Gemini can actually read them
            binary_parts.push(openrouter::BinaryPart {
                mime_type: mime_type.clone(),
                bytes: bytes.to_vec(),
            });
        }
        // Other binary types (pptx with no text, etc.) are silently skipped
    }

    // 4. Build text input and determine if we're working from metadata only
    let (text_input, metadata_only) = if native_texts.is_empty() && binary_parts.is_empty() {
        (format!("{title}\n\n{description}"), true)
    } else {
        (extractor::combine_texts(native_texts), false)
    };

    // 5. LLM call — if multimodal fails (corrupted/unsupported file), fall back to text-only
    tracing::info!(
        artifact_id,
        text_len = text_input.len(),
        binary_parts = binary_parts.len(),
        metadata_only,
        "calling OpenRouter LLM"
    );
    let ai = match with_backoff(|| openrouter::summarize_and_tag(
        ai_client, &text_input, &binary_parts, metadata_only,
    )).await {
        Ok(ai) => ai,
        Err(e) if !binary_parts.is_empty() => {
            tracing::warn!(artifact_id, "multimodal LLM failed ({e}), retrying text-only");
            let mo = text_input.trim().is_empty();
            with_backoff(|| openrouter::summarize_and_tag(ai_client, &text_input, &[], mo)).await?
        }
        Err(e) => return Err(e),
    };

    // 6. Embed: title + description + summary + tags
    tracing::info!(artifact_id, "calling OpenRouter embed");
    let embed_input = format!("{title}\n{description}\n{}\n{}", ai.summary, ai.tags.join(" "));
    let raw_vec = with_backoff(|| openrouter::embed(ai_client, &embed_input)).await?;
    let embedding = pgvector::Vector::from(raw_vec);

    // Phase C: write — reacquire a connection only for the two fast writes.
    let mut conn = pool.get().await?;
    let now = now_secs();
    diesel::update(artifact_ai_meta::table.filter(artifact_ai_meta::artifact_id.eq(artifact_id)))
        .set((
            artifact_ai_meta::summary.eq(&ai.summary),
            artifact_ai_meta::tags.eq(&ai.tags),
            artifact_ai_meta::status.eq(STATUS_DONE),
            artifact_ai_meta::processed_at.eq(now),
            artifact_ai_meta::updated_at.eq(now),
        ))
        .execute(&mut conn)
        .await?;

    diesel::insert_into(artifact_embedding::table)
        .values(NewArtifactEmbedding {
            artifact_id: artifact_id.to_string(),
            embedding,
        })
        .on_conflict(artifact_embedding::artifact_id)
        .do_update()
        .set(artifact_embedding::embedding.eq(diesel::upsert::excluded(artifact_embedding::embedding)))
        .execute(&mut conn)
        .await?;

    tracing::info!(artifact_id, tags = ?ai.tags, "AI processing done");
    Ok(())
}

/// Exponential backoff on HTTP 429 or transient errors. 3 retries: 1s, 2s, 4s.
async fn with_backoff<T, F, Fut>(mut f: F) -> Result<T>
where
    F: FnMut() -> Fut,
    Fut: std::future::Future<Output = Result<T>>,
{
    let mut delay = Duration::from_secs(1);
    for attempt in 0..3 {
        match f().await {
            Ok(v) => return Ok(v),
            Err(e) => {
                if attempt == 2 {
                    return Err(e);
                }
                let s = e.to_string();
                let is_transient = s.contains("429") || s.contains("status error");
                if !is_transient {
                    return Err(e);
                }
                tracing::warn!("OpenRouter rate limit / transient, retry in {delay:?}: {e}");
                tokio::time::sleep(delay).await;
                delay *= 2;
            }
        }
    }
    unreachable!()
}

async fn mark_failed(pool: &Pool<AsyncPgConnection>, artifact_id: &str) {
    let Ok(mut conn) = pool.get().await else { return };
    let _ = diesel::sql_query(
        "UPDATE artifact_ai_meta
         SET retry_count = retry_count + 1,
             status = CASE WHEN retry_count + 1 >= 3 THEN 'permanently_failed' ELSE 'failed' END,
             updated_at = $1
         WHERE artifact_id = $2"
    )
    .bind::<diesel::sql_types::BigInt, _>(now_secs())
    .bind::<diesel::sql_types::Text, _>(artifact_id)
    .execute(&mut conn)
    .await;
}

