module walrus_ai_policy::artifact;

use sui::event;
use walrus_ai_policy::contributor;
use walrus_ai_policy::file;
use walrus_ai_policy::metadata;

const EInvalidRoot: u64 = 0;

public struct Artifact has key {
    id: UID,
    root_id: Option<ID>,
    parent_id: Option<ID>,
    metadata: metadata::Metadata,
    contributor: Option<vector<contributor::Contributor>>,
}

public struct ArtifactEvent has copy, drop {
    id: ID,
    root_id: Option<ID>,
    parent_id: Option<ID>,
    metadata: metadata::Metadata,
    contributor: Option<vector<contributor::Contributor>>,
}

public fun init_artifact(metadata: metadata::Metadata, files: file::FileRef, ctx: &mut TxContext) {
    // Create record object
    let mut artifact_object = Artifact {
        id: object::new(ctx),
        root_id: option::none(),
        parent_id: option::none(),
        metadata,
        contributor: contributor::init_contributor(ctx.sender()),
    };

    // Update Files
    file::init_file(
        &mut artifact_object.id,
        files,
    );

    // Emit event
    event::emit(ArtifactEvent {
        id: artifact_object.id.to_inner(),
        root_id: artifact_object.root_id,
        parent_id: artifact_object.parent_id,
        metadata: artifact_object.metadata,
        contributor: artifact_object.contributor,
    });

    // Share for accessible
    transfer::share_object(artifact_object)
}

public fun commit_artifact_without_parent(
    root: &Artifact,
    metadata: metadata::Metadata,
    files: file::FileRef,
    ctx: &mut TxContext,
) {
    assert!(root.parent_id.is_none());
    assert!(root.root_id.is_none());

    create_artifact(root, option::none<ID>(), metadata, files, ctx)
}

public fun commit_artifact_with_parent(
    root: &Artifact,
    parent: &Artifact,
    metadata: metadata::Metadata,
    files: file::FileRef,
    ctx: &mut TxContext,
) {
    let parent_id = parent.id.to_inner();

    assert!(
        parent.root_id.is_some() && parent.root_id.borrow() == root.id.to_inner(),
        EInvalidRoot,
    );

    create_artifact(root, option::some(parent_id), metadata, files, ctx)
}

fun create_artifact(
    root: &Artifact,
    parent: Option<ID>,
    metadata: metadata::Metadata,
    files: file::FileRef,
    ctx: &mut TxContext,
) {
    if (root.contributor.is_some()) {
        contributor::check_role(root.contributor.borrow(), contributor::get_role_admin(), ctx);
    };

    let root_id = root.id.to_inner();

    let parent_id = if (parent.is_some()) {
        *parent.borrow()
    } else {
        root_id
    };

    // Create record object
    let mut artifact_object = Artifact {
        id: object::new(ctx),
        root_id: option::some(root_id),
        parent_id: option::some(parent_id),
        metadata,
        contributor: option::none(),
    };

    // Update Dynamic fields
    file::init_file(
        &mut artifact_object.id,
        files,
    );

    // Emit event
    event::emit(ArtifactEvent {
        id: artifact_object.id.to_inner(),
        root_id: artifact_object.root_id,
        parent_id: artifact_object.parent_id,
        metadata: artifact_object.metadata,
        contributor: artifact_object.contributor,
    });

    // Share for accessible
    transfer::share_object(artifact_object)
}
