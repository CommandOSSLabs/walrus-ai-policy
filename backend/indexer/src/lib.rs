use diesel_migrations::{EmbeddedMigrations, embed_migrations};

pub mod ai;
pub mod db;
pub mod events;
pub mod processors;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations");
