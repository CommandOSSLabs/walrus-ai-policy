diesel::table! {
    artifact (sui_object_id) {
        sui_object_id  -> Text,
        owner          -> Text,
        title          -> Text,
        description    -> Text,
        topics         -> Array<Text>,
        categories     -> Array<Text>,
        authors        -> Jsonb,
        institution    -> Text,
        published_date -> Date,
        license        -> Text,
        tags           -> Array<Text>,
        revision_of    -> Nullable<Text>,
        created_epoch  -> BigInt,
        updated_epoch  -> BigInt,
        file_count     -> Integer,
    }
}
