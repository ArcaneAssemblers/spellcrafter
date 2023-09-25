#[system]
mod Forage {
    use traits::Into;
    use box::BoxTrait;
    use dojo::world::Context;

    use spellcrafter::components::{Owner, ValueInGame};
    use spellcrafter::utils::assertions::{assert_caller_is_owner, assert_is_alive};
    use spellcrafter::cards::selection::random_card_from_region;
    use spellcrafter::types::Region;

    // In the context of a particular game, forage in a given region
    // This will add a random spell component to the players hand
    fn execute(ctx: Context, game_id: u128, region: Region) -> u128 {
        assert_caller_is_owner(ctx, game_id);
        assert_is_alive(ctx, game_id);
        
        // TODO This is not simulation safe. Ok for quick protyping only
        let tx_info = starknet::get_tx_info().unbox();
        let seed = tx_info.transaction_hash;

        let card_id = random_card_from_region(seed, region);

        let card = get!(ctx.world, (card_id, game_id), ValueInGame);
        set!(ctx.world, ValueInGame {
            entity_id: card.entity_id,
            game_id: card.game_id,
            value: card.value + 1
        });

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

    fn build_calldata(game_id: u128, region: Region) -> Array<felt252> {
        let mut calldata = array![];
        Serde::serialize(@game_id, ref calldata);
        Serde::serialize(@Region::Forest, ref calldata);
        calldata
    }
}
