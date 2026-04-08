module walrus_archive::metadata;

use std::string::String;
use sui::clock::Clock;

const TITLE_LIMIT: u64 = 100;
const DESCRIPTION_LIMIT: u64 = 280;
const CATEGORY_LIMIT: u64 = 20;

const EExceedLength: u64 = 0;

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
    assert!(title.length() <= TITLE_LIMIT, EExceedLength);
    assert!(description.length() <= DESCRIPTION_LIMIT, EExceedLength);
    assert!(category.length() <= CATEGORY_LIMIT, EExceedLength);

    Metadata {
        title,
        description,
        version: 0,
        creator: ctx.sender(),
        category,
        created_at: clock.timestamp_ms(),
    }
}

public fun get_title_limit(): u64 {
    TITLE_LIMIT
}

public fun get_description_limit(): u64 {
    DESCRIPTION_LIMIT
}

public fun get_category_limit(): u64 {
    CATEGORY_LIMIT
}

// ===== Tests =====

#[test_only]
const ADMIN: address = @0xA;
#[test_only]
use std::string::{Self};
#[test_only]
use sui::clock::{Self};

#[test_only]
fun make_ascii_string(len: u64): String {
    let mut i = 0;
    let mut bytes = vector::empty<u8>();

    while (i < len) {
        vector::push_back(&mut bytes, 97);
        i = i + 1;
    };

    string::utf8(bytes)
}

#[test]
fun test_new_metadata() {
    let mut ctx = tx_context::new_from_hint(ADMIN, 0, 0, 0, 0);
    let clock = clock::create_for_testing(&mut ctx);

    let _metadata = new_metadata(
        string::utf8(b"walrus artifact"),
        string::utf8(b"artifact description"),
        string::utf8(b"ai"),
        &clock,
        &mut ctx,
    );

    clock::destroy_for_testing(clock);
}

#[test, expected_failure(abort_code = EExceedLength)]
fun test_title_exceed() {
    let mut ctx = tx_context::new_from_hint(ADMIN, 0, 0, 0, 0);
    let clock = clock::create_for_testing(&mut ctx);

    new_metadata(
        make_ascii_string(TITLE_LIMIT + 1),
        make_ascii_string(DESCRIPTION_LIMIT),
        make_ascii_string(CATEGORY_LIMIT),
        &clock,
        &mut ctx,
    );

    clock::destroy_for_testing(clock);
}

#[test, expected_failure(abort_code = EExceedLength)]
fun test_description_exceed() {
    let mut ctx = tx_context::new_from_hint(ADMIN, 0, 0, 0, 0);
    let clock = clock::create_for_testing(&mut ctx);

    new_metadata(
        make_ascii_string(TITLE_LIMIT),
        make_ascii_string(DESCRIPTION_LIMIT + 1),
        make_ascii_string(CATEGORY_LIMIT),
        &clock,
        &mut ctx,
    );

    clock::destroy_for_testing(clock);
}

#[test, expected_failure(abort_code = EExceedLength)]
fun test_category_exceed() {
    let mut ctx = tx_context::new_from_hint(ADMIN, 0, 0, 0, 0);
    let clock = clock::create_for_testing(&mut ctx);

    new_metadata(
        make_ascii_string(TITLE_LIMIT),
        make_ascii_string(DESCRIPTION_LIMIT),
        make_ascii_string(CATEGORY_LIMIT + 1),
        &clock,
        &mut ctx,
    );

    clock::destroy_for_testing(clock);
}
