use anyhow::{bail, Context, Result};
use async_openai::types::chat::{
    ChatCompletionRequestMessage,
    ChatCompletionRequestUserMessage,
    ChatCompletionRequestUserMessageContent,
    ChatCompletionRequestUserMessageContentPart,
    ChatCompletionRequestMessageContentPartText,
    ChatCompletionRequestMessageContentPartImage,
    CreateChatCompletionRequestArgs,
    ImageUrl,
    ResponseFormat,
};

pub use archive_db::ai::{AiClient, make_client, embed};

const CHAT_MODEL: &str = "google/gemini-2.0-flash-001";

#[derive(Debug)]
pub struct AiSummary {
    pub summary: String,
    pub tags:    Vec<String>,
}

/// A binary file (PDF, image) to be sent as a multimodal inline part.
pub struct BinaryPart {
    pub mime_type: String,
    pub bytes:     Vec<u8>,
}

pub async fn summarize_and_tag(
    client:        &AiClient,
    text:          &str,
    binary_parts:  &[BinaryPart],
    metadata_only: bool,
) -> Result<AiSummary> {
    #[derive(serde::Deserialize)]
    struct AiJson { summary: String, tags: Vec<String> }

    let prompt = if metadata_only {
        build_metadata_only_prompt(text)
    } else {
        build_summarize_prompt(text)
    };

    let content = if binary_parts.is_empty() {
        ChatCompletionRequestUserMessageContent::Text(prompt)
    } else {
        use base64::Engine;
        let mut parts: Vec<ChatCompletionRequestUserMessageContentPart> = vec![
            ChatCompletionRequestUserMessageContentPart::Text(
                ChatCompletionRequestMessageContentPartText { text: prompt }
            ),
        ];
        for part in binary_parts {
            let b64 = base64::engine::general_purpose::STANDARD.encode(&part.bytes);
            parts.push(ChatCompletionRequestUserMessageContentPart::ImageUrl(
                ChatCompletionRequestMessageContentPartImage {
                    image_url: ImageUrl {
                        url: format!("data:{};base64,{}", part.mime_type, b64),
                        detail: None,
                    },
                }
            ));
        }
        ChatCompletionRequestUserMessageContent::Array(parts)
    };

    let message = ChatCompletionRequestMessage::User(ChatCompletionRequestUserMessage {
        content,
        name: None,
    });

    let request = CreateChatCompletionRequestArgs::default()
        .model(CHAT_MODEL)
        .messages([message])
        .response_format(ResponseFormat::JsonObject)
        .build()?;

    let response = client.chat().create(request).await?;

    let raw = response.choices.into_iter().next()
        .context("llm had no choices")?
        .message.content
        .context("llm returned no content")?;

    let parsed: AiJson = serde_json::from_str(&raw).map_err(|e| {
        tracing::warn!(raw = %raw, "llm returned invalid JSON: {e}");
        anyhow::anyhow!("llm returned invalid JSON: {e}")
    })?;

    if parsed.summary.is_empty() || parsed.tags.is_empty() {
        bail!("llm returned empty summary or tags");
    }

    Ok(AiSummary { summary: parsed.summary, tags: parsed.tags })
}

fn build_summarize_prompt(text: &str) -> String {
    format!(
        "You are a document analyst. The input below starts with the artifact's title and \
         description (the definitive source of what this artifact is about), followed by its \
         file content. Return ONLY valid JSON with exactly two fields:\n\
         - \"summary\": 2-3 sentences describing the artifact's main purpose and key takeaways, \
           grounded in the title/description even if file content seems unrelated.\n\
         - \"tags\": an array of 2 to 3 concise tags that cover the core topic — no more. \
           Use the title/description as the primary signal; ignore file metadata noise \
           (ICC profiles, image formats, music notation, etc.) unless the artifact is explicitly \
           about those things.\n\
         Return ONLY the JSON object, no other text.\n\
         Content:\n\n{text}"
    )
}

/// Used when no file content is available — only artifact title and description.
fn build_metadata_only_prompt(metadata: &str) -> String {
    format!(
        "You are a document analyst. You only have the artifact's title and description. \
         Return ONLY valid JSON with exactly two fields:\n\
         - \"summary\": 2-3 sentences describing the artifact's main purpose and key takeaways.\n\
         - \"tags\": an array of 2 to 3 concise tags covering the core topic — no more.\n\
         Return ONLY the JSON object, no other text.\n\
         Artifact metadata:\n\n{metadata}"
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn summarize_prompt_contains_json_instruction() {
        let prompt = build_summarize_prompt("some content");
        assert!(prompt.contains("JSON"));
        assert!(prompt.contains("summary"));
        assert!(prompt.contains("tags"));
    }

    #[test]
    fn summarize_prompt_includes_content() {
        let content = "unique_content_marker_xyz";
        let prompt = build_summarize_prompt(content);
        assert!(prompt.contains(content));
    }
}
