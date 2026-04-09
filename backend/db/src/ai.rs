//! Shared OpenRouter / async-openai helpers used by both the indexer and GraphQL crates.

use anyhow::{bail, Context, Result};
use async_openai::{Client, config::OpenAIConfig, types::embeddings::CreateEmbeddingRequestArgs};

pub const OPENROUTER_BASE: &str = "https://openrouter.ai/api/v1";
pub const EMBED_MODEL:     &str = "openai/text-embedding-3-small";
pub const EMBED_DIMS:       u32 = 512;

pub type AiClient = Client<OpenAIConfig>;

pub fn make_client(api_key: &str) -> AiClient {
    Client::with_config(
        OpenAIConfig::new()
            .with_api_base(OPENROUTER_BASE)
            .with_api_key(api_key),
    )
}

pub async fn embed(client: &AiClient, text: &str) -> Result<Vec<f32>> {
    if text.is_empty() {
        bail!("embed: text must not be empty");
    }

    let request = CreateEmbeddingRequestArgs::default()
        .model(EMBED_MODEL)
        .input(text)
        .dimensions(EMBED_DIMS)
        .build()?;

    let response = client.embeddings().create(request).await?;
    response.data.into_iter().next()
        .map(|d| d.embedding)
        .context("embed response had no data")
}

