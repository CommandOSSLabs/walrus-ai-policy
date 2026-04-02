mod artifact_processor;
mod contributor_processor;

pub use artifact_processor::ArtifactPipeline;
pub use contributor_processor::ContributorPipeline;
pub(crate) use artifact_processor::bytes_to_hex;

pub(crate) fn is_transient_error(e: &diesel::result::Error) -> bool {
    matches!(
        e,
        diesel::result::Error::DatabaseError(
            diesel::result::DatabaseErrorKind::SerializationFailure,
            _,
        )
    )
}
