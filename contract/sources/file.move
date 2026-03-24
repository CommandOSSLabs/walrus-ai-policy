module walrus_ai_policy::file;

use std::string::String;
use sui::dynamic_field;

const EFilesMustHave: u64 = 0;
const FILE_REF_DF: u8 = 1;

public struct FileInfo has copy, drop, store {
    patch_id: String,
    mime_type: String,
    size_bytes: u64,
}

public struct FileRef has copy, drop, store {
    files: vector<FileInfo>,
}

public fun new_file(
    patch_id: &mut vector<String>,
    mime_type: &mut vector<String>,
    size_bytes: &mut vector<u64>,
): FileRef {
    let total_length = patch_id.length();

    assert!(mime_type.length() == total_length, EFilesMustHave);
    assert!(size_bytes.length() == total_length, EFilesMustHave);

    let mut files = vector::empty<FileInfo>();
    while (!vector::is_empty(patch_id)) {
        vector::push_back(
            &mut files,
            FileInfo {
                patch_id: vector::remove(patch_id, 0),
                mime_type: vector::remove(mime_type, 0),
                size_bytes: vector::remove(size_bytes, 0),
            },
        );
    };

    FileRef {
        files,
    }
}

public fun init_file(artifact_id: &mut UID, files: FileRef) {
    dynamic_field::add<u8, FileRef>(
        artifact_id,
        FILE_REF_DF,
        files,
    );
}
