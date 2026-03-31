module walrus_ai_policy::contributor;

use sui::event;

const ROLE_MODERATOR: u8 = 0;
const ROLE_ADMIN: u8 = 1;

const EMustHaveRole: u64 = 2;
const ERoleNotExists: u64 = 3;
const ERoleAlreadyExists: u64 = 4;
const ECreatorNotFound: u64 = 5;
const ECannotRemoveSelf: u64 = 6;

public struct Contributor has copy, drop, store {
    role: u8,
    creator: address,
}

public struct ContributorEvent has copy, drop {
    role: Option<u8>,
    creator: address,
    root_id: ID,
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

    assert!(role == ROLE_ADMIN || role == ROLE_MODERATOR, ERoleNotExists);
    assert!(contributors.any!(|c| c.creator == sender && c.role == role), EMustHaveRole);
}

public fun remove_role(
    contributor: &mut vector<Contributor>,
    root_id: ID,
    target: address,
    ctx: &TxContext,
) {
    check_role(contributor, get_role_admin(), ctx);

    assert!(target != ctx.sender(), ECannotRemoveSelf);

    let mut i = 0;
    while (i < contributor.length()) {
        if (contributor.borrow(i).creator == target) {
            let borrow_contributor = contributor.remove(i);

            event::emit(ContributorEvent {
                role: option::none(),
                creator: borrow_contributor.creator,
                root_id,
            });

            return
        };

        i = i + 1;
    };

    abort ECreatorNotFound;
}

public fun add_role(
    contributor: &mut vector<Contributor>,
    root_id: ID,
    target: address,
    role: u8,
    ctx: &TxContext,
) {
    check_role(contributor, get_role_admin(), ctx);

    assert!(role == ROLE_ADMIN || role == ROLE_MODERATOR, ERoleNotExists);
    assert!(!contributor.any!(|c| c.creator == target), ERoleAlreadyExists);

    contributor.push_back(Contributor {
        role,
        creator: target,
    });

    event::emit(ContributorEvent {
        role: option::some(role),
        creator: target,
        root_id,
    });
}

public fun get_role_admin(): u8 {
    ROLE_ADMIN
}

public fun get_role_moderator(): u8 {
    ROLE_MODERATOR
}

// ===== Tests =====

#[test_only]
const ADMIN: address = @0xA;
#[test_only]
const NEW_USER: address = @0xD;
#[test_only]
const ROOT_ID: address = @0xABCD;

#[test]
fun test_init_contributor() {
    let ctx = tx_context::new_from_hint(ADMIN, 0, 0, 0, 0);
    let contributors = init_contributor(ADMIN);

    check_role(contributors.borrow(), get_role_admin(), &ctx);
}

#[test]
fun test_role() {
    let ctx = tx_context::new_from_hint(ADMIN, 0, 0, 0, 0);
    let contributors = init_contributor(ADMIN);
    let mut vec = *contributors.borrow();
    let mut roles = vector[ROLE_ADMIN, ROLE_MODERATOR];

    // you must have admin role
    assert!(vec.any!(|e| e.creator == ctx.sender() && e.role == ROLE_ADMIN), EMustHaveRole);

    while (vector::length(&roles) > 1) {
        let role = vector::pop_back(&mut roles);

        // add role
        add_role(
            &mut vec,
            object::id_from_address(ROOT_ID),
            NEW_USER,
            role,
            &ctx,
        );
        assert!(vec.any!(|e| e.creator == NEW_USER && e.role == role), EMustHaveRole);

        // remove role
        remove_role(
            &mut vec,
            object::id_from_address(ROOT_ID),
            NEW_USER,
            &ctx,
        );

        assert!(!vec.any!(|e| e.creator == NEW_USER), EMustHaveRole);
    };
}
