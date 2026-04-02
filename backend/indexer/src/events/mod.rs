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
pub struct ContributorEvent {
    pub role: Option<u8>,
    pub creator: [u8; 32],
    pub root_id: [u8; 32],
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
    pub hash: String,
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde::Serialize;

    // Mirror structs for BCS serialization — production types only derive Deserialize.
    // BCS encodes field-by-field in declaration order, so these must match exactly.
    #[derive(Serialize)]
    struct SMetadata {
        title: String,
        description: String,
        version: u64,
        creator: [u8; 32],
        category: String,
        created_at: u64,
    }

    #[derive(Serialize)]
    struct SContributor {
        role: u8,
        creator: [u8; 32],
    }

    #[derive(Serialize)]
    struct SArtifactEvent {
        id: [u8; 32],
        root_id: Option<[u8; 32]>,
        parent_id: Option<[u8; 32]>,
        metadata: SMetadata,
        contributor: Option<Vec<SContributor>>,
    }

    #[derive(Serialize)]
    struct SFileInfo {
        patch_id: String,
        mime_type: String,
        size_bytes: u64,
        name: String,
        hash: String,
    }

    #[derive(Serialize)]
    struct SFileRef {
        files: Vec<SFileInfo>,
    }

    #[derive(Serialize)]
    struct SFieldObject<V> {
        id: [u8; 32],
        name: u8,
        value: V,
    }

    fn base_meta() -> SMetadata {
        SMetadata {
            title: "Policy v1".to_string(),
            description: "Initial policy".to_string(),
            version: 0,
            creator: [0xab; 32],
            category: "governance".to_string(),
            created_at: 1_700_000_000,
        }
    }

    #[test]
    fn roundtrip_root_artifact_event() {
        let src = SArtifactEvent {
            id: [1u8; 32],
            root_id: None,
            parent_id: None,
            metadata: base_meta(),
            contributor: None,
        };
        let ev: ArtifactEvent = bcs::from_bytes(&bcs::to_bytes(&src).unwrap()).unwrap();

        assert_eq!(ev.id, [1u8; 32]);
        assert!(ev.root_id.is_none());
        assert!(ev.parent_id.is_none());
        assert_eq!(ev.metadata.title, "Policy v1");
        assert_eq!(ev.metadata.creator, [0xab; 32]);
        assert_eq!(ev.metadata.created_at, 1_700_000_000);
        assert_eq!(ev.metadata.category, "governance");
        assert!(ev.contributor.is_none());
    }

    #[test]
    fn roundtrip_commit_artifact_event() {
        let src = SArtifactEvent {
            id: [2u8; 32],
            root_id: Some([1u8; 32]),
            parent_id: Some([1u8; 32]),
            metadata: base_meta(),
            contributor: None,
        };
        let ev: ArtifactEvent = bcs::from_bytes(&bcs::to_bytes(&src).unwrap()).unwrap();

        assert_eq!(ev.id, [2u8; 32]);
        assert_eq!(ev.root_id, Some([1u8; 32]));
        assert_eq!(ev.parent_id, Some([1u8; 32]));
    }

    #[test]
    fn roundtrip_event_with_contributors() {
        let src = SArtifactEvent {
            id: [3u8; 32],
            root_id: None,
            parent_id: None,
            metadata: base_meta(),
            contributor: Some(vec![
                SContributor { role: 0, creator: [0x01; 32] },
                SContributor { role: 1, creator: [0x02; 32] },
            ]),
        };
        let ev: ArtifactEvent = bcs::from_bytes(&bcs::to_bytes(&src).unwrap()).unwrap();

        let contributors = ev.contributor.unwrap();
        assert_eq!(contributors.len(), 2);
        assert_eq!(contributors[0].role, 0);
        assert_eq!(contributors[0].creator, [0x01; 32]);
        assert_eq!(contributors[1].role, 1);
        assert_eq!(contributors[1].creator, [0x02; 32]);
    }

    #[test]
    fn roundtrip_field_object_with_files() {
        let src = SFieldObject {
            id: [0u8; 32],
            name: 0u8, // FILE_REF_DF = 0
            value: SFileRef {
                files: vec![SFileInfo {
                    patch_id: "patch-abc123".to_string(),
                    mime_type: "text/plain".to_string(),
                    size_bytes: 4096,
                    name: "policy.txt".to_string(),
                    hash: "abc123hash".to_string(),
                }],
            },
        };
        let field: FieldObject<FileRef> = bcs::from_bytes(&bcs::to_bytes(&src).unwrap()).unwrap();

        assert_eq!(field.name, 0);
        assert_eq!(field.value.files.len(), 1);
        let f = &field.value.files[0];
        assert_eq!(f.patch_id, "patch-abc123");
        assert_eq!(f.mime_type, "text/plain");
        assert_eq!(f.size_bytes, 4096);
        assert_eq!(f.name, "policy.txt");
    }

    #[test]
    fn roundtrip_field_object_with_multiple_files() {
        let src = SFieldObject {
            id: [0u8; 32],
            name: 0u8,
            value: SFileRef {
                files: vec![
                    SFileInfo { patch_id: "p1".to_string(), mime_type: "text/plain".to_string(), size_bytes: 100, name: "a.txt".to_string(), hash: "h1".to_string() },
                    SFileInfo { patch_id: "p2".to_string(), mime_type: "application/json".to_string(), size_bytes: 200, name: "b.json".to_string(), hash: "h2".to_string() },
                ],
            },
        };
        let field: FieldObject<FileRef> = bcs::from_bytes(&bcs::to_bytes(&src).unwrap()).unwrap();
        assert_eq!(field.value.files.len(), 2);
        assert_eq!(field.value.files[1].name, "b.json");
    }

    #[test]
    fn roundtrip_field_object_empty_files() {
        let src = SFieldObject { id: [0u8; 32], name: 0u8, value: SFileRef { files: vec![] } };
        let field: FieldObject<FileRef> = bcs::from_bytes(&bcs::to_bytes(&src).unwrap()).unwrap();
        assert!(field.value.files.is_empty());
    }

    #[test]
    fn field_object_name_preserved() {
        // name=1 is NOT FILE_REF_DF (which is 0) — processor must skip this
        let src = SFieldObject { id: [0u8; 32], name: 1u8, value: SFileRef { files: vec![] } };
        let field: FieldObject<FileRef> = bcs::from_bytes(&bcs::to_bytes(&src).unwrap()).unwrap();
        assert_eq!(field.name, 1); // processor skips this (name != FILE_REF_DF)
    }

    // --- BCS error paths ---
    // Guards against panics if the chain emits malformed event bytes.
    // The processor uses filter_map / .ok() so these must be Err, never panics.

    #[test]
    fn empty_bytes_artifact_event_is_error() {
        assert!(bcs::from_bytes::<ArtifactEvent>(&[]).is_err());
    }

    #[test]
    fn truncated_artifact_event_is_error() {
        let src = SArtifactEvent {
            id: [1u8; 32],
            root_id: None,
            parent_id: None,
            metadata: base_meta(),
            contributor: None,
        };
        let full = bcs::to_bytes(&src).unwrap();
        assert!(bcs::from_bytes::<ArtifactEvent>(&full[..full.len() / 2]).is_err());
    }

    #[test]
    fn truncated_field_object_is_error() {
        let src = SFieldObject {
            id: [0u8; 32],
            name: 1u8,
            value: SFileRef {
                files: vec![SFileInfo {
                    patch_id: "p".to_string(),
                    mime_type: "text/plain".to_string(),
                    size_bytes: 100,
                    name: "a.txt".to_string(),
                    hash: "h".to_string(),
                }],
            },
        };
        let full = bcs::to_bytes(&src).unwrap();
        assert!(bcs::from_bytes::<FieldObject<FileRef>>(&full[..full.len() / 2]).is_err());
    }

    #[test]
    fn u64_max_values_survive_roundtrip() {
        // Ensures we never truncate large timestamps / version counters from the chain.
        let src = SArtifactEvent {
            id: [0xffu8; 32],
            root_id: None,
            parent_id: None,
            metadata: SMetadata {
                title: String::new(),
                description: String::new(),
                version: u64::MAX,
                creator: [0u8; 32],
                category: String::new(),
                created_at: u64::MAX,
            },
            contributor: None,
        };
        let ev: ArtifactEvent = bcs::from_bytes(&bcs::to_bytes(&src).unwrap()).unwrap();
        assert_eq!(ev.metadata.version, u64::MAX);
        assert_eq!(ev.metadata.created_at, u64::MAX);
    }
}
