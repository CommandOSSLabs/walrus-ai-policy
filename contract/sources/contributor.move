module walrus_ai_policy::contributor;

const ROLE_ADMIN: u8 = 1;

const EMustHaveRole: u64 = 2;

public struct Contributor has copy, drop, store {
    role: u8,
    creator: address,
}

public fun init_contributor(creator: address): Option<vector<Contributor>> {
    option::some(vector[
        Contributor {
            role: ROLE_ADMIN,
            creator,
        },
    ])
}

public fun check_role(contributors: &vector<Contributor>, role: u8, ctx: &TxContext) {
    let sender = ctx.sender();

    assert!(contributors.any!(|c| c.creator == sender && c.role == role), EMustHaveRole);
}

public fun get_role_admin(): u8 {
    ROLE_ADMIN
}
