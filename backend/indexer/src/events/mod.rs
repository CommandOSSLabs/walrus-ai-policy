use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Author {
    pub name: String,
    pub orcid: Option<String>,
    pub affiliation: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ArtifactCreatedEvent {
    pub sui_object_id: String,
    pub owner: String,
    pub title: String,
    pub description: String,
    pub topics: Vec<String>,
    pub categories: Vec<String>,
    pub authors: Vec<Author>,
    pub institution: String,
    pub published_date: String,
    pub license: String,
    pub tags: Vec<String>,
    pub revision_of: Option<String>,
    pub created_epoch: u64,
}

#[derive(Debug, Deserialize)]
pub struct ArtifactUpdatedEvent {
    pub sui_object_id: String,
    pub title: String,
    pub description: String,
    pub topics: Vec<String>,
    pub categories: Vec<String>,
    pub authors: Vec<Author>,
    pub tags: Vec<String>,
    pub updated_epoch: u64,
}

#[derive(Debug, Deserialize)]
pub struct FileUpsertedEvent {
    pub sui_object_id: String,
}

#[derive(Debug, Deserialize)]
pub struct FileRemovedEvent {
    pub sui_object_id: String,
}

pub enum ArtifactEvent {
    Created(ArtifactCreatedEvent),
    Updated(ArtifactUpdatedEvent),
    FileUpserted(FileUpsertedEvent),
    FileRemoved(FileRemovedEvent),
}
