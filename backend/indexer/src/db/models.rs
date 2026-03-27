use diesel::prelude::*;

use crate::db::schema::artifact;
use crate::db::schema::artifact_file;

#[derive(Insertable, Debug)]
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

#[derive(Insertable, Debug)]
#[diesel(table_name = artifact_file)]
pub struct NewArtifactFile {
    pub artifact_id: String,
    pub patch_id: String,
    pub mime_type: String,
    pub size_bytes: i64,
    pub name: String,
}
