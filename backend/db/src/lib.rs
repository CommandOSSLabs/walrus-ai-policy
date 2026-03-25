diesel::table! {
    artifact (sui_object_id) {
        sui_object_id -> Text,
        root_id       -> Nullable<Text>,
        parent_id     -> Nullable<Text>,
        title         -> Text,
        description   -> Text,
        version       -> BigInt,
        creator       -> Text,
        category      -> Text,
        created_at    -> BigInt,
    }
}

diesel::table! {
    artifact_file (id) {
        id          -> BigInt,
        artifact_id -> Text,
        patch_id    -> Text,
        mime_type   -> Text,
        size_bytes  -> BigInt,
    }
}
