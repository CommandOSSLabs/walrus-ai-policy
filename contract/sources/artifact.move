module walrus_ai_policy::artifact;

use sui::event;
use walrus_ai_policy::contributor;
use walrus_ai_policy::file;
use walrus_ai_policy::metadata;

const EInvalidRoot: u64 = 0;
const EContributorNotFound: u64 = 1;

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

public fun management_role(
    artifact: &mut Artifact,
    target: address,
    role: Option<u8>,
    ctx: &mut TxContext,
) {
    assert!(artifact.contributor.is_some(), EContributorNotFound);

    let contributors = artifact.contributor.borrow_mut();

    if (role.is_some()) {
        contributor::add_role(
            contributors,
            target,
            *role.borrow(),
            ctx,
        );
    } else {
        contributor::remove_role(
            contributors,
            target,
            ctx,
        );
    }
}

// ===== Tests =====

#[test_only]
const ADMIN: address = @0xA;
#[test_only]
use std::string;
#[test_only]
use sui::clock;

#[test_only]
fun make_metadata(clock: &clock::Clock, ctx: &mut TxContext): metadata::Metadata {
    metadata::new_metadata(
        string::utf8(b"artifact"),
        string::utf8(b"test metadata"),
        string::utf8(b"ai"),
        clock,
        ctx,
    )
}

#[test_only]
fun make_file_ref(): file::FileRef {
    let mut patch_id = vector[string::utf8(b"patch-1")];
    let mut mime_type = vector[string::utf8(b"text/plain")];
    let mut size_bytes = vector[42];
    let mut name = vector[string::utf8(b"file.txt")];

    file::new_file(&mut patch_id, &mut mime_type, &mut size_bytes, &mut name)
}

#[test_only]
fun delete_local_artifact(artifact: Artifact) {
    let Artifact {
        id,
        root_id: _,
        parent_id: _,
        metadata: _,
        contributor: _,
    } = artifact;

    object::delete(id);
}

#[test]
fun test_init_artifact() {
    let mut ctx = tx_context::new_from_hint(ADMIN, 0, 0, 0, 0);
    let test_clock = clock::create_for_testing(&mut ctx);

    init_artifact(make_metadata(&test_clock, &mut ctx), make_file_ref(), &mut ctx);

    clock::destroy_for_testing(test_clock);
}

#[test]
fun test_commit_artifact_without_parent() {
    let mut ctx = tx_context::new_from_hint(ADMIN, 0, 0, 0, 0);
    let test_clock = clock::create_for_testing(&mut ctx);

    let root = Artifact {
        id: object::new(&mut ctx),
        root_id: option::none(),
        parent_id: option::none(),
        metadata: make_metadata(&test_clock, &mut ctx),
        contributor: contributor::init_contributor(ADMIN),
    };

    commit_artifact_without_parent(
        &root,
        make_metadata(&test_clock, &mut ctx),
        make_file_ref(),
        &mut ctx,
    );

    delete_local_artifact(root);
    clock::destroy_for_testing(test_clock);
}

#[test]
fun test_commit_artifact_with_parent() {
    let mut ctx = tx_context::new_from_hint(ADMIN, 0, 0, 0, 0);
    let test_clock = clock::create_for_testing(&mut ctx);

    let root = Artifact {
        id: object::new(&mut ctx),
        root_id: option::none(),
        parent_id: option::none(),
        metadata: make_metadata(&test_clock, &mut ctx),
        contributor: contributor::init_contributor(ADMIN),
    };

    let root_id = root.id.to_inner();
    let parent = Artifact {
        id: object::new(&mut ctx),
        root_id: option::some(root_id),
        parent_id: option::some(root_id),
        metadata: make_metadata(&test_clock, &mut ctx),
        contributor: option::none(),
    };

    commit_artifact_with_parent(
        &root,
        &parent,
        make_metadata(&test_clock, &mut ctx),
        make_file_ref(),
        &mut ctx,
    );

    delete_local_artifact(parent);
    delete_local_artifact(root);
    clock::destroy_for_testing(test_clock);
}

#[test, expected_failure(abort_code = EInvalidRoot)]
fun test_commit_artifact_with_parent_invalid_root() {
    let mut ctx = tx_context::new_from_hint(ADMIN, 0, 0, 0, 0);
    let test_clock = clock::create_for_testing(&mut ctx);

    let root = Artifact {
        id: object::new(&mut ctx),
        root_id: option::none(),
        parent_id: option::none(),
        metadata: make_metadata(&test_clock, &mut ctx),
        contributor: contributor::init_contributor(ADMIN),
    };

    let parent = Artifact {
        id: object::new(&mut ctx),
        root_id: option::none(),
        parent_id: option::none(),
        metadata: make_metadata(&test_clock, &mut ctx),
        contributor: option::none(),
    };

    commit_artifact_with_parent(
        &root,
        &parent,
        make_metadata(&test_clock, &mut ctx),
        make_file_ref(),
        &mut ctx,
    );

    delete_local_artifact(parent);
    delete_local_artifact(root);
    clock::destroy_for_testing(test_clock);
}
