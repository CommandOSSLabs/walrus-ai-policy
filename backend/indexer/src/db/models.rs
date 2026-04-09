use diesel::prelude::*;

use crate::db::schema::artifact;
use crate::db::schema::artifact_ai_meta;
use crate::db::schema::artifact_contributor;
use crate::db::schema::artifact_embedding;
use crate::db::schema::artifact_file;

#[derive(Insertable, Debug, Clone)]
#[diesel(table_name = artifact)]
pub struct NewArtifact {
    pub sui_object_id: String,
    pub root_id: Option<String>,
    pub parent_id: Option<String>,
    pub title: String,
    pub description: String,
    pub version: i64,
    pub creator: String,
    pub category: String,
    pub created_at: i64,
    pub total_size_bytes: i64,
}

#[derive(Insertable, Debug, Clone)]
#[diesel(table_name = artifact_file)]
pub struct NewArtifactFile {
    pub artifact_id: String,
    pub patch_id: String,
    pub mime_type: String,
    pub size_bytes: i64,
    pub name: String,
    pub hash: String,
}

#[derive(Insertable, Debug, Clone)]
#[diesel(table_name = artifact_contributor)]
pub struct NewArtifactContributor {
    pub root_id: String,
    pub creator: String,
    pub role: i16,
}

#[derive(Insertable, Debug, Clone)]
#[diesel(table_name = artifact_ai_meta)]
pub struct NewArtifactAiMeta {
    pub artifact_id: String,
    pub created_at: i64,
    pub updated_at: i64,
    // status, tags, retry_count use column defaults ('pending', '{}', 0)
}

#[derive(Insertable, Debug, Clone)]
#[diesel(table_name = artifact_embedding)]
pub struct NewArtifactEmbedding {
    pub artifact_id: String,
    pub embedding:   pgvector::Vector,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn new_artifact_ai_meta_fields() {
        let now = 1_700_000_000i64;
        let m = NewArtifactAiMeta {
            artifact_id: "0xabc".to_string(),
            created_at: now,
            updated_at: now,
        };
        assert_eq!(m.artifact_id, "0xabc");
        assert_eq!(m.created_at, now);
        assert_eq!(m.updated_at, now);
    }

    #[test]
    fn new_artifact_embedding_uses_pgvector_type() {
        let v: Vec<f32> = vec![0.1, 0.2, 0.3];
        let emb = NewArtifactEmbedding {
            artifact_id: "0xdef".to_string(),
            embedding: pgvector::Vector::from(v.clone()),
        };
        assert_eq!(emb.artifact_id, "0xdef");
        assert_eq!(Vec::<f32>::from(emb.embedding), v);
    }
}
