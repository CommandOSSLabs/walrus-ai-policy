diesel::table! {
    artifact (sui_object_id) {
        sui_object_id   -> Text,
        root_id         -> Nullable<Text>,
        parent_id       -> Nullable<Text>,
        title           -> Text,
        description     -> Text,
        version         -> BigInt,
        creator         -> Text,
        category        -> Text,
        created_at      -> BigInt,
        total_size_bytes -> BigInt,
    }
}

diesel::table! {
    artifact_file (id) {
        id          -> BigInt,
        artifact_id -> Text,
        patch_id    -> Text,
        mime_type   -> Text,
        size_bytes  -> BigInt,
        name        -> Text,
        hash        -> Text,
    }
}

diesel::table! {
    artifact_version_counts (root_id) {
        root_id            -> Text,
        version_count      -> BigInt,
        latest_artifact_id -> Nullable<Text>,
    }
}

diesel::table! {
    artifact_contributor (root_id, creator) {
        root_id -> Text,
        creator -> Text,
        role    -> SmallInt,
    }
}

diesel::table! {
    platform_stats (id) {
        id               -> Integer,
        total_size_bytes -> BigInt,
    }
}

diesel::table! {
    artifact_stats (root_id) {
        root_id        -> Text,
        view_count     -> BigInt,
        download_count -> BigInt,
    }
}

diesel::table! {
    artifact_viewer (root_id, viewer_address) {
        root_id        -> Text,
        viewer_address -> Text,
    }
}

