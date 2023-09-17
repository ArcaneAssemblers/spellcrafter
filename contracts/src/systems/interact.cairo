#[system]
mod Interact {
    use traits::Into;
    use dojo::world::Context;
    use spellcrafter::components::{ValueInGame};
    use spellcrafter::utils::assertions::{assert_caller_is_owner, assert_is_alive};
    use spellcrafter::utils::random::pass_check;
    use spellcrafter::cards::actions::{enact_card, bust_barrier, is_dead};
    use spellcrafter::constants::{CHAOS_STAT};


    fn execute(ctx: Context, game_id: u128, item_id: u128) {
        assert_caller_is_owner(ctx, game_id);
        assert_is_alive(ctx, game_id);

        // TODO This is not simulation safe. Ok for quick protyping only
        let tx_info = starknet::get_tx_info().unbox();
        let seed = tx_info.transaction_hash;

        let owned = get!(ctx.world, (item_id, game_id), ValueInGame).value;
        assert(owned > 0, 'Item is not owned');
        
        let chaos = get!(ctx.world, (CHAOS_STAT, game_id), ValueInGame).value;

        if !pass_check(seed, chaos) {
            bust_barrier(ctx, game_id);
        }

        if !is_dead(ctx, game_id) {
            enact_card(ctx, game_id, item_id);
        }
    }
}

#[cfg(test)]
mod tests {
    use traits::{Into, TryInto};
    use result::ResultTrait;
    use array::ArrayTrait;
    use option::OptionTrait;
    use serde::Serde;
    
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use spellcrafter::utils::testing::initialize_world;
    use spellcrafter::components::{Owner, ValueInGame};

    #[test]
    #[should_panic(expected: ('Item is not owned', 'ENTRYPOINT_FAILED', 'ENTRYPOINT_FAILED', 'ENTRYPOINT_FAILED') )]
    #[available_gas(300000000000)]
    fn reverts_if_card_not_owned() {
        let CARD_ID: u128 = 1;

        let world = initialize_world();
        let result = world.execute('NewGame', array![]);
        let game_id: u128 = (*result[0]).try_into().unwrap();

        // pre conditions
        let card = get!(world, (CARD_ID, game_id), ValueInGame);
        assert(card.value == 0, 'count not initially 0');

        let result = world.execute('Interact', build_calldata(game_id, CARD_ID));
    }

    #[test]
    #[available_gas(300000000000)]
    fn works_if_card_owned() {
        let world = initialize_world();
        starknet::testing::set_contract_address(world.executor());

        let CARD_ID: u128 = 1;

        let result = world.execute('NewGame', array![]);
        let game_id: u128 = (*result[0]).try_into().unwrap();

        // pre conditions
        set!(world, ValueInGame{ entity_id: CARD_ID, game_id: game_id, value: 1 });
        let result = world.execute('Interact', build_calldata(game_id, CARD_ID));
    }

    fn build_calldata(game_id: u128, item_id: u128) -> Array<felt252> {
        let mut calldata = array![];
        Serde::serialize(@game_id, ref calldata);
        Serde::serialize(@item_id, ref calldata);
        calldata
    }
}