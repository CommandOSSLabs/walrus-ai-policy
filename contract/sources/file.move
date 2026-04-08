module walrus_archive::file;

use std::string::String;
use sui::dynamic_field;

const FILE_REF_DF: u8 = 0;
const FILE_LIMIT: u64 = 100;

const EFilesMustHave: u64 = 0;
const EFilesExceedLength: u64 = 1;

public struct FileInfo has copy, drop, store {
    patch_id: String,
    mime_type: String,
    size_bytes: u64,
    name: String,
    hash: String,
}

public struct FileRef has copy, drop, store {
    files: vector<FileInfo>,
}

public fun new_file(
    patch_id: &mut vector<String>,
    mime_type: &mut vector<String>,
    size_bytes: &mut vector<u64>,
    name: &mut vector<String>,
    hash: &mut vector<String>,
): FileRef {
    let total_length = patch_id.length();

    assert!(total_length < FILE_LIMIT, EFilesExceedLength);
    assert!(mime_type.length() == total_length, EFilesMustHave);
    assert!(size_bytes.length() == total_length, EFilesMustHave);
    assert!(name.length() == total_length, EFilesMustHave);
    assert!(hash.length() == total_length, EFilesMustHave);

    let mut files = vector::empty<FileInfo>();
    while (!vector::is_empty(patch_id)) {
        vector::push_back(
            &mut files,
            FileInfo {
                patch_id: vector::remove(patch_id, 0),
                mime_type: vector::remove(mime_type, 0),
                size_bytes: vector::remove(size_bytes, 0),
                name: vector::remove(name, 0),
                hash: vector::remove(hash, 0),
            },
        );
    };

    FileRef {
        files,
    }
}

public fun init_file(artifact_id: &mut UID, files: FileRef) {
    assert!(files.files.length() < FILE_LIMIT, EFilesExceedLength);

    dynamic_field::add<u8, FileRef>(
        artifact_id,
        FILE_REF_DF,
        files,
    );
}

public fun get_file_limit(): u64 {
    FILE_LIMIT
}

// ===== Tests =====

#[test_only]
const ADMIN: address = @0xA;
#[test_only]
const FILE_LENGTH: u64 = 2;
#[test_only]
use std::string::{Self};

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

#[test_only]
fun make_file_vectors(
    len: u64,
): (vector<String>, vector<String>, vector<u64>, vector<String>, vector<String>) {
    let mut i = 0;
    let mut patch_id = vector::empty<String>();
    let mut mime_type = vector::empty<String>();
    let mut size_bytes = vector::empty<u64>();
    let mut name = vector::empty<String>();
    let mut hash = vector::empty<String>();

    while (i < len) {
        vector::push_back(&mut patch_id, make_ascii_string(8));
        vector::push_back(&mut mime_type, string::utf8(b"text/plain"));
        vector::push_back(&mut size_bytes, 100);
        vector::push_back(&mut name, string::utf8(b"file.txt"));
        vector::push_back(&mut hash, string::utf8(b"file.txt"));
        i = i + 1;
    };

    (patch_id, mime_type, size_bytes, name, hash)
}

#[test]
fun test_new_file() {
    let (mut patch_id, mut mime_type, mut size_bytes, mut name, mut hash) = make_file_vectors(
        FILE_LENGTH,
    );

    new_file(&mut patch_id, &mut mime_type, &mut size_bytes, &mut name, &mut hash);
}

#[test, expected_failure(abort_code = EFilesMustHave)]
fun test_new_file_failure_mismatch_length() {
    let (mut patch_id, mut mime_type, mut size_bytes, mut name, mut hash) = make_file_vectors(
        FILE_LENGTH,
    );

    vector::pop_back(&mut name); // accident pop name

    new_file(&mut patch_id, &mut mime_type, &mut size_bytes, &mut name, &mut hash);
}

#[test, expected_failure(abort_code = EFilesExceedLength)]
fun test_new_file_failure_file_limit() {
    let (mut patch_id, mut mime_type, mut size_bytes, mut name, mut hash) = make_file_vectors(
        FILE_LIMIT,
    );

    new_file(&mut patch_id, &mut mime_type, &mut size_bytes, &mut name, &mut hash);
}

#[test]
fun test_init_file() {
    let mut ctx = tx_context::new_from_hint(ADMIN, 0, 0, 0, 0);
    let mut artifact_id = object::new(&mut ctx);
    let (mut patch_id, mut mime_type, mut size_bytes, mut name, mut hash) = make_file_vectors(
        FILE_LENGTH,
    );

    let files = new_file(&mut patch_id, &mut mime_type, &mut size_bytes, &mut name, &mut hash);
    init_file(&mut artifact_id, files);

    let _stored = dynamic_field::remove<u8, FileRef>(&mut artifact_id, FILE_REF_DF);
    object::delete(artifact_id);
}
