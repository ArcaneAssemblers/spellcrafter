#[system]
mod Forage {
    use traits::Into;
    use dojo::world::Context;

    use spellcrafter::components::{Owner, ValueInGame};
    use spellcrafter::utils::assert_caller_is_owner;
    use spellcrafter::types::Region;

    // In the context of a particular game, forage in a given region
    // This will add a random spell component to the players hand
    fn execute(ctx: Context, game_id: u128, region: Region) {
        assert_caller_is_owner(ctx, game_id);
        // currently adds 1 of card type 1 to the hand
        let CARD_ID: u32 = 1;

        let card = get!(ctx.world, (CARD_ID, game_id), ValueInGame);

        set!(ctx.world, ValueInGame {
            entity_id: card.entity_id,
            game_id: card.game_id,
            value: card.value + 1
        });

        return ();
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
        let CARD_ID: u128 = 1;

        let world = initialize_world();        
        let result = world.execute('Init', array![]);
        let game_id: u128 = (*result[0]).try_into().unwrap();

        // pre conditions
        let card = get!(world, (CARD_ID, game_id), ValueInGame);
        assert(card.value == 0, 'count not initially 0');

        let result = world.execute('Forage', build_calldata(game_id, Region::Forest));

        // post conditions
        let card = get!(world, (CARD_ID, game_id), ValueInGame);
        assert(card.value == 1, 'failed to add ingredient');
    }

    fn build_calldata(game_id: u128, region: Region) -> Array<felt252> {
        let mut calldata = array![];
        Serde::serialize(@game_id, ref calldata);
        Serde::serialize(@Region::Forest, ref calldata);
        calldata
    }
}
