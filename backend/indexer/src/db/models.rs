use chrono::NaiveDate;
use diesel::prelude::*;

use crate::db::schema::artifact;

#[derive(Insertable, Debug)]
#[diesel(table_name = artifact)]
pub struct NewArtifact {
    pub sui_object_id: String,
    pub owner: String,
    pub title: String,
    pub description: String,
    pub topics: Vec<String>,
    pub categories: Vec<String>,
    pub authors: serde_json::Value,
    pub institution: String,
    pub published_date: NaiveDate,
    pub license: String,
    pub tags: Vec<String>,
    pub revision_of: Option<String>,
    pub created_epoch: i64,
    pub updated_epoch: i64,
    pub file_count: i32,
}
