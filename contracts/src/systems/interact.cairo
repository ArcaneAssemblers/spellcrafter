#[system]
mod Interact {
    use traits::Into;
    use dojo::world::Context;
    use spellcrafter::components::{ValueInGame};
    use spellcrafter::utils::assert_caller_is_owner;
    use spellcrafter::cards::actions::enact_card;

    fn execute(ctx: Context, game_id: u128, item_id: u128) {
        assert_caller_is_owner(ctx, game_id);
        
        let owned = get!(ctx.world, (item_id, game_id), ValueInGame).value;
        assert(owned > 0, 'Item is not owned');

        enact_card(ctx, game_id, item_id);
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

    // not sure how to write test that are meant to revert..
    // #[test]
    // #[available_gas(300000000000)]
    // fn reverts_if_card_not_owned() {
    //     let CARD_ID: u128 = 1;

    //     let world = initialize_world();
    //     let result = world.execute('Init', array![]);
    //     let game_id: u128 = (*result[0]).try_into().unwrap();

    //     // pre conditions
    //     let card = get!(world, (CARD_ID, game_id), ValueInGame);
    //     assert(card.value == 0, 'count not initially 0');

    //     let result = world.execute('Interact', build_calldata(game_id, CARD_ID));
    // }

    #[test]
    #[available_gas(300000000000)]
    fn works_if_card_owned() {
        let world = initialize_world();
        starknet::testing::set_contract_address(world.executor());

        let CARD_ID: u128 = 1;

        let result = world.execute('Init', array![]);
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