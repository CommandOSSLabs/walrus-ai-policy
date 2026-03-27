use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Metadata {
    pub title: String,
    pub description: String,
    pub version: u64,
    pub creator: [u8; 32],
    pub category: String,
    pub created_at: u64,
}

#[derive(Debug, Deserialize)]
pub struct Contributor {
    pub role: u8,
    pub creator: [u8; 32],
}

#[derive(Debug, Deserialize)]
pub struct ArtifactEvent {
    pub id: [u8; 32],
    pub root_id: Option<[u8; 32]>,
    pub parent_id: Option<[u8; 32]>,
    pub metadata: Metadata,
    pub contributor: Option<Vec<Contributor>>,
}

#[derive(Debug, Deserialize)]
pub struct FieldObject<V> {
    pub id: [u8; 32],
    pub name: u8,
    pub value: V,
}

#[derive(Debug, Deserialize)]
pub struct FileRef {
    pub files: Vec<FileInfo>,
}

#[derive(Debug, Deserialize)]
pub struct FileInfo {
    pub patch_id: String,
    pub mime_type: String,
    pub size_bytes: u64,
    pub name: String,
}
