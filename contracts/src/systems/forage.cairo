#[system]
mod Forage {
    use traits::Into;
    use box::BoxTrait;
    use dojo::world::Context;

    use spellcrafter::constants::{CHAOS_STAT, ITEMS_HELD, CHAOS_PER_FORAGE, ITEM_LIMIT};
    use spellcrafter::components::{Owner, ValueInGame};
    use spellcrafter::utils::assertions::{assert_caller_is_owner, assert_is_alive};
    use spellcrafter::cards::selection::random_card_from_region;
    use spellcrafter::cards::actions::{increase_stat, stat_meets_threshold};
    use spellcrafter::types::Region;

    // In the context of a particular game, forage in a given region
    // This will add a random spell component to the players hand
    fn execute(ctx: Context, game_id: u128, region: Region) -> u128 {
        assert_caller_is_owner(ctx, game_id);
        assert_is_alive(ctx, game_id);
        assert(!stat_meets_threshold(ctx, game_id, ITEMS_HELD, Option::Some((ITEM_LIMIT, false))), 'Too many items held');
        
        // TODO This is not simulation safe. Ok for quick protyping only
        let tx_info = starknet::get_tx_info().unbox();
        let seed = tx_info.transaction_hash;

        let card_id = random_card_from_region(seed, region);

        // increase chaos by a fixed amount. In the future this will be a function of time
        increase_stat(ctx, game_id, CHAOS_STAT, CHAOS_PER_FORAGE);
        // increase the number of that card
        increase_stat(ctx, game_id, card_id, 1);
        // increase the total number of items held
        increase_stat(ctx, game_id, ITEMS_HELD, 1);

        return card_id;
    }
}

#[cfg(test)]
mod tests {
    use traits::{Into, TryInto};
    use result::ResultTrait;
    use array::ArrayTrait;
    use option::OptionTrait;
    use serde::Serde;
    
    use dojo::world::{ IWorldDispatcher, IWorldDispatcherTrait};

    use spellcrafter::types::Region;
    use spellcrafter::utils::testing::initialize_world;
    use spellcrafter::components::{Owner, ValueInGame};
    use spellcrafter::constants::{ITEMS_HELD, ITEM_LIMIT};


    #[test]
    #[available_gas(300000000000)]
    fn forage() {
        let world = initialize_world();        
        let result = world.execute('NewGame', array![]);
        let game_id: u128 = (*result[0]).try_into().unwrap();

        let result = world.execute('Forage', build_calldata(game_id, Region::Forest));
        let card_id: u128 = (*result[0]).try_into().unwrap();

        // post conditions
        let card = get!(world, (card_id, game_id), ValueInGame);
        assert(card.value == 1, 'failed to add ingredient');
    }

    #[test]
    #[available_gas(300000000000)]
    #[should_panic(expected: ('Too many items held', 'ENTRYPOINT_FAILED', 'ENTRYPOINT_FAILED', 'ENTRYPOINT_FAILED') )]
    fn cannot_exceed_max_items() {
        let world = initialize_world();        
        let result = world.execute('NewGame', array![]);
        let game_id: u128 = (*result[0]).try_into().unwrap();

        // pre conditions
        let items = get!(world, (ITEMS_HELD, game_id), ValueInGame).value;
        assert(items == 0, 'not initially no items');

        let mut i = 0;
        loop {
            if i >= ITEM_LIMIT {
                break;
            }
            world.execute('Forage', build_calldata(game_id, Region::Forest));
            i += 1;
        };

        // post conditions
        let items = get!(world, (ITEMS_HELD, game_id), ValueInGame).value;
        assert(items == ITEM_LIMIT, 'not expected n_items');

        // should fail
        world.execute('Forage', build_calldata(game_id, Region::Forest));
    }

    fn build_calldata(game_id: u128, region: Region) -> Array<felt252> {
        let mut calldata = array![];
        Serde::serialize(@game_id, ref calldata);
        Serde::serialize(@Region::Forest, ref calldata);
        calldata
    }
}
