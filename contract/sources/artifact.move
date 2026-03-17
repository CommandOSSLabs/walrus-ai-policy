module walrus_ai_policy::artifact;

use std::string::{String, utf8};
use sui::clock::Clock;
use sui::dynamic_field;
use sui::event;

const ERecordPermission: u64 = 0;

// Constants roles
const ROLE_ADMIN: vector<u8> = b"admin";
// const ROLE_MODERATOR: vector<u8> = b"moderator";

public struct Record has key {
    id: UID,
    root_id: Option<ID>,
    parent_id: Option<ID>,
    creator: address,
    created_at: u64,
}

public struct RecordEvent has copy, drop {
    record_id: ID,
    root_id: Option<ID>,
    parent_id: Option<ID>,
    creator: address,
    created_at: u64,
}

public fun create_artifact(quilt_ids: &mut vector<String>, clock: &Clock, ctx: &mut TxContext) {
    let sender = ctx.sender();
    let timestamp = clock.timestamp_ms();

    // Create record object
    let mut record_object = Record {
        id: object::new(ctx),
        root_id: option::none(),
        parent_id: option::none(),
        creator: sender,
        created_at: timestamp,
    };

    // Update DF for quilt
    while (!quilt_ids.is_empty()) {
        let quilt = quilt_ids.pop_back();

        dynamic_field::add(&mut record_object.id, quilt, true);
    };

    // Update DF for role
    dynamic_field::add(&mut record_object.id, sender, utf8(ROLE_ADMIN));

    // Emit event
    event::emit(RecordEvent {
        record_id: record_object.id.to_inner(),
        root_id: record_object.root_id,
        parent_id: record_object.parent_id,
        creator: record_object.creator,
        created_at: record_object.created_at,
    });

    // Share for accessible
    transfer::share_object(record_object)
}

public fun commit_artifact(
    record_root: &Record,
    record_parent: &Record,
    quilt_ids: &mut vector<String>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    check_role(record_root, ROLE_ADMIN, ctx);

    let sender = ctx.sender();
    let timestamp = clock.timestamp_ms();

    // Create record object
    let mut record_object = Record {
        id: object::new(ctx),
        root_id: option::some(record_root.id.to_inner()),
        parent_id: option::some(record_parent.id.to_inner()),
        creator: sender,
        created_at: timestamp,
    };

    // Update DF for quilt
    while (!quilt_ids.is_empty()) {
        let quilt = quilt_ids.pop_back();

        dynamic_field::add(&mut record_object.id, quilt, true);
    };

    // Emit event
    event::emit(RecordEvent {
        record_id: record_object.id.to_inner(),
        root_id: record_object.root_id,
        parent_id: record_object.parent_id,
        creator: record_object.creator,
        created_at: record_object.created_at,
    });

    // Share for accessible
    transfer::share_object(record_object)
}

fun check_role(record_parent: &Record, role: vector<u8>, ctx: &TxContext) {
    // sender must have role
    let sender = ctx.sender();
    assert!(dynamic_field::exists_(&record_parent.id, sender), ERecordPermission);

    // available roles
    let borrow_role = dynamic_field::borrow<address, String>(&record_parent.id, sender);

    assert!(*borrow_role == utf8(role), ERecordPermission);
}

public fun remove_contributor(record: &mut Record, ctx: &mut TxContext) {
    // Sender must have permission
    let sender = ctx.sender();
    check_role(record, ROLE_ADMIN, ctx);

    dynamic_field::remove_if_exists<address, String>(&mut record.id, sender);
}

public fun add_contributor(record: &mut Record, role: vector<u8>, ctx: &mut TxContext) {
    // Sender must have permission
    let sender = ctx.sender();
    check_role(record, ROLE_ADMIN, ctx);

    // Update DF role
    let record_uid = &mut record.id;
    if (!dynamic_field::exists_(record_uid, sender)) {
        dynamic_field::add(record_uid, sender, utf8(role));
    };
}
