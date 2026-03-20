module walrus_ai_policy::artifact;

use sui::clock::Clock;
use sui::dynamic_field;
use sui::event;

const EMustHaveRole: u64 = 0;
const EAlreadyHaveRole: u64 = 1;
const EInvalidRoot: u64 = 2;

// Constants roles
const ROLE_ADMIN: u8 = 1;

public struct Artifact has key {
    id: UID,
    root_id: Option<ID>,
    parent_id: Option<ID>,
    blob_id: u256,
    creator: address,
    created_at: u64,
}

public struct ArtifactEvent has copy, drop {
    id: ID,
    root_id: Option<ID>,
    parent_id: Option<ID>,
    blob_id: u256,
    creator: address,
    created_at: u64,
}

public fun create_artifact(blob_id: u256, clock: &Clock, ctx: &mut TxContext) {
    let sender = ctx.sender();
    let timestamp = clock.timestamp_ms();

    // Create record object
    let mut artifact_object = Artifact {
        id: object::new(ctx),
        root_id: option::none(),
        parent_id: option::none(),
        blob_id,
        creator: sender,
        created_at: timestamp,
    };

    // Update DF for role
    dynamic_field::add<address, u8>(&mut artifact_object.id, sender, ROLE_ADMIN);

    // Emit event
    event::emit(ArtifactEvent {
        id: artifact_object.id.to_inner(),
        root_id: artifact_object.root_id,
        parent_id: artifact_object.parent_id,
        blob_id: artifact_object.blob_id,
        creator: artifact_object.creator,
        created_at: artifact_object.created_at,
    });

    // Share for accessible
    transfer::share_object(artifact_object)
}

public fun commit_artifact(
    blob_id: u256,
    root: &Artifact,
    parent: &Artifact,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    check_role(root, ROLE_ADMIN, ctx);

    let root_id = root.id.to_inner();
    let parent_id = parent.id.to_inner();

    /*
        ID  PARENT  ROOT
        0   null   null
        1   0       0
        2   1       0
        3   2       0
    */
    let parent_root_id = option::get_with_default(&parent.root_id, parent_id);
    assert!(parent_root_id  == root_id, EInvalidRoot);

    // Create record object
    let artifact_object = Artifact {
        id: object::new(ctx),
        root_id: option::some(root_id),
        parent_id: option::some(parent_id),
        blob_id,
        creator: ctx.sender(),
        created_at: clock.timestamp_ms(),
    };

    // Emit event
    event::emit(ArtifactEvent {
        id: artifact_object.id.to_inner(),
        root_id: artifact_object.root_id,
        parent_id: artifact_object.parent_id,
        blob_id: artifact_object.blob_id,
        creator: artifact_object.creator,
        created_at: artifact_object.created_at,
    });

    // Share for accessible
    transfer::share_object(artifact_object);
}

fun check_role(root: &Artifact, role: u8, ctx: &TxContext) {
    let sender = ctx.sender();

    assert!(dynamic_field::exists_(&root.id, sender), EMustHaveRole);
    assert!(*dynamic_field::borrow<address, u8>(&root.id, sender) == role);
}

public fun remove_contributor(record: &mut Artifact, ctx: &mut TxContext) {
    check_role(record, ROLE_ADMIN, ctx);

    dynamic_field::remove_if_exists<address, u8>(&mut record.id, ctx.sender());
}

public fun add_contributor(root: &mut Artifact, role: u8, ctx: &mut TxContext) {
    check_role(root, ROLE_ADMIN, ctx);

    let sender = ctx.sender();
    let uid = &mut root.id;

    assert!(!dynamic_field::exists_<address>(uid, sender), EAlreadyHaveRole);

    dynamic_field::add<address, u8>(uid, sender, role);
}
