use std::io::Read;

const MAX_FILE_BYTES:  usize = 5 * 1024 * 1024;  // 5MB: skip files larger than this
const MAX_PER_FILE:    usize = 100 * 1024;         // 100KB extracted text per file
const MAX_TOTAL_BYTES: usize = 128 * 1024;         // 128KB total to LLM

/// Returns extracted plain text, or None if the MIME type requires LLM extraction.
/// Binary types (pdf, pptx, etc.) → None → caller sends to LLM.
pub fn extract_text(bytes: &[u8], mime_type: &str) -> Option<String> {
    let mime = mime_type.split(';').next().unwrap_or("").trim();
    match mime {
        m if m.starts_with("text/html") => Some(extract_html(&String::from_utf8_lossy(bytes))),
        // SVG is XML text — strip tags; returns None if no readable text (pure path/graphic SVGs)
        "image/svg+xml" => {
            let text = strip_xml_tags(&String::from_utf8_lossy(bytes));
            if text.trim().is_empty() { None } else { Some(text) }
        }
        m if m.starts_with("text/") => {
            Some(String::from_utf8_lossy(bytes).into_owned())
        }
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => {
            Some(extract_docx(bytes).unwrap_or_default())
        }
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" => {
            Some(extract_xlsx(bytes).unwrap_or_default())
        }
        _ => None, // pdf, pptx, doc, rtf, epub, etc. → LLM path
    }
}

pub fn is_too_large(size_bytes: u64) -> bool {
    size_bytes as usize > MAX_FILE_BYTES
}

/// Combine per-file texts: truncate each to MAX_PER_FILE, then truncate total to MAX_TOTAL_BYTES.
pub fn combine_texts(texts: Vec<String>) -> String {
    let per_file_truncated: Vec<String> = texts
        .into_iter()
        .map(|t| truncate_to_bytes(&t, MAX_PER_FILE).to_owned())
        .collect();
    let joined = per_file_truncated.join("\n\n");
    truncate_to_bytes(&joined, MAX_TOTAL_BYTES).to_owned()
}

pub fn truncate_to_bytes(s: &str, max: usize) -> &str {
    if s.len() <= max {
        return s;
    }
    let mut end = max;
    while !s.is_char_boundary(end) {
        end -= 1;
    }
    &s[..end]
}

pub(crate) fn extract_html(html: &str) -> String {
    let doc = scraper::Html::parse_document(html);
    doc.root_element()
        .text()
        .flat_map(|s| s.split_whitespace())
        .collect::<Vec<_>>()
        .join(" ")
}

fn extract_docx(bytes: &[u8]) -> anyhow::Result<String> {
    use std::io::Cursor;
    let cursor = Cursor::new(bytes);
    let mut zip = zip::ZipArchive::new(cursor)?;
    let mut xml_file = zip.by_name("word/document.xml")?;
    let mut xml = String::new();
    xml_file.read_to_string(&mut xml)?;
    Ok(strip_xml_tags(&xml))
}

fn extract_xlsx(bytes: &[u8]) -> anyhow::Result<String> {
    use calamine::{open_workbook_from_rs, Reader, Xlsx};
    use std::io::Cursor;
    let cursor = Cursor::new(bytes);
    let mut wb: Xlsx<_> = open_workbook_from_rs(cursor)?;
    let mut parts = Vec::new();
    for name in wb.sheet_names().to_vec() {
        if let Ok(range) = wb.worksheet_range(&name) {
            for row in range.rows() {
                let line: Vec<String> = row.iter()
                    .map(|c| c.to_string())
                    .filter(|s| !s.is_empty())
                    .collect();
                if !line.is_empty() {
                    parts.push(line.join("\t"));
                }
            }
        }
    }
    Ok(parts.join("\n"))
}

fn strip_xml_tags(xml: &str) -> String {
    let mut reader = quick_xml::Reader::from_str(xml);
    reader.config_mut().trim_text(true);
    let mut text_parts = Vec::new();
    let mut buf = Vec::new();
    loop {
        match reader.read_event_into(&mut buf) {
            Ok(quick_xml::events::Event::Text(e)) => {
                if let Ok(s) = e.unescape() {
                    let s = s.trim().to_string();
                    if !s.is_empty() {
                        text_parts.push(s);
                    }
                }
            }
            Ok(quick_xml::events::Event::Eof) => break,
            Err(_) => break,
            _ => {}
        }
        buf.clear();
    }
    text_parts.join(" ")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn truncate_bytes_at_limit() {
        let s = "a".repeat(200_000);
        let r = truncate_to_bytes(&s, 100_000);
        assert!(r.len() <= 100_000);
        assert!(s.is_char_boundary(r.len()));
    }

    #[test]
    fn truncate_bytes_short_string_unchanged() {
        let s = "hello world";
        assert_eq!(truncate_to_bytes(s, 100_000), s);
    }

    #[test]
    fn html_stripping_removes_tags() {
        let html = "<html><body><p>Hello <b>world</b></p></body></html>";
        let text = extract_html(html);
        assert!(text.contains("Hello"));
        assert!(text.contains("world"));
        assert!(!text.contains('<'));
    }

    #[test]
    fn plain_text_extracted_as_is() {
        let bytes = b"hello world";
        let result = extract_text(bytes, "text/plain");
        assert_eq!(result.as_deref(), Some("hello world"));
    }

    #[test]
    fn binary_mime_returns_none_for_native_extraction() {
        let result = extract_text(b"", "application/pdf");
        assert!(result.is_none());
    }

    #[test]
    fn total_cap_applied() {
        let pieces = vec![
            "a".repeat(50_000),
            "b".repeat(50_000),
            "c".repeat(50_000),
        ];
        let combined = combine_texts(pieces);
        assert!(combined.len() <= 128 * 1024);
    }

    #[test]
    fn is_too_large_threshold() {
        assert!(!is_too_large(5 * 1024 * 1024));       // exactly 5MB = not too large
        assert!(is_too_large(5 * 1024 * 1024 + 1));    // 1 byte over = too large
    }

    #[test]
    fn html_with_charset_in_mime_strips_correctly() {
        // MIME types like "text/html; charset=utf-8" should still match
        let bytes = b"<p>Test</p>";
        let result = extract_text(bytes, "text/html; charset=utf-8");
        assert!(result.is_some());
        assert!(result.unwrap().contains("Test"));
    }

    #[test]
    fn combine_texts_empty_input() {
        let result = combine_texts(vec![]);
        assert_eq!(result, "");
    }
}
