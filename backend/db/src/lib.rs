pub mod ai;

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

diesel::table! {
    artifact_ai_meta (artifact_id) {
        artifact_id  -> Text,
        summary      -> Nullable<Text>,
        tags         -> Array<Text>,
        status       -> Text,
        retry_count  -> SmallInt,
        created_at   -> BigInt,
        processed_at -> Nullable<BigInt>,
        updated_at   -> BigInt,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use pgvector::sql_types::*;

    artifact_embedding (artifact_id) {
        artifact_id -> Text,
        embedding   -> Vector,
    }
}

diesel::joinable!(artifact_ai_meta -> artifact (artifact_id));

diesel::allow_tables_to_appear_in_same_query!(
    artifact,
    artifact_ai_meta,
);

/// Reciprocal Rank Fusion: merges ranked lists and returns (id, score) sorted descending.
/// k=60 is the standard dampening constant; top_n caps the output.
pub fn rrf_merge(lists: Vec<Vec<String>>, k: usize, top_n: usize) -> Vec<(String, f64)> {
    let mut scores: std::collections::HashMap<String, f64> = std::collections::HashMap::new();
    for list in lists {
        for (rank_zero, id) in list.into_iter().enumerate() {
            let rank = rank_zero + 1;
            *scores.entry(id).or_insert(0.0) += 1.0 / (k as f64 + rank as f64);
        }
    }
    let mut sorted: Vec<(String, f64)> = scores.into_iter().collect();
    sorted.sort_by(|a, b| b.1.total_cmp(&a.1));
    sorted.truncate(top_n);
    sorted
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rrf_single_list_ranks_by_position() {
        let scores = rrf_merge(vec![vec!["a".into(), "b".into(), "c".into()]], 60, 3);
        assert_eq!(scores[0].0, "a");
        assert_eq!(scores[1].0, "b");
        assert_eq!(scores[2].0, "c");
    }

    #[test]
    fn rrf_document_in_both_lists_scores_higher() {
        let scores = rrf_merge(
            vec![vec!["shared".into(), "only_a".into()], vec!["shared".into(), "only_b".into()]],
            60, 3,
        );
        assert_eq!(scores[0].0, "shared");
    }

    #[test]
    fn rrf_respects_top_n_limit() {
        let list = (0..20).map(|i| i.to_string()).collect();
        assert_eq!(rrf_merge(vec![list], 60, 5).len(), 5);
    }

    #[test]
    fn rrf_empty_lists_yields_empty_result() {
        assert!(rrf_merge(vec![vec![], vec![]], 60, 10).is_empty());
    }
}
