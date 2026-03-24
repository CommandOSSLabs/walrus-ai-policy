module walrus_ai_policy::metadata;

use std::string::String;
use sui::clock::Clock;

public struct Metadata has copy, drop, store {
    title: String,
    description: String,
    version: u64,
    creator: address,
    category: String,
    created_at: u64,
}

public fun new_metadata(
    title: String,
    description: String,
    category: String,
    clock: &Clock,
    ctx: &mut TxContext,
): Metadata {
    Metadata {
        title,
        description,
        version: 0,
        creator: ctx.sender(),
        category,
        created_at: clock.timestamp_ms(),
    }
}

public fun get_creator(metadata: &Metadata): address {
    metadata.creator
}
