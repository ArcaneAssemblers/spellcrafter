#[system]
mod Forage {
    use traits::Into;
    use dojo::world::Context;

    use spellcrafter::components::{Owner, Ingredient};
    use spellcrafter::types::Region;

    // In the context of a particular game, forage in a given region
    // This will add a random ingredient to the game
    fn execute(ctx: Context, game_id: u128, region: Region) {
        // currently adds 1 of ingredient type 2 to the game
        let RESOURCE_ID: u32 = 2;

        let owner = get!(ctx.world, game_id, Owner);
        assert(owner.address == ctx.origin, 'Only the owner can interact');

        let ingredient = get!(ctx.world, (game_id, RESOURCE_ID), Ingredient);
        set!(ctx.world, Ingredient {
            entity_id: ingredient.entity_id,
            ingredient_type: ingredient.ingredient_type,
            count: ingredient.count + 1
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
    use spellcrafter::components::{Owner, Ingredient};

    #[test]
    #[available_gas(300000000000)]
    fn init_world() {
        let world = initialize_world();
        let result = world.execute('Init', array![]);
        let game_id: u128 = (*result[0]).try_into().unwrap();

        // pre conditions
        let ingredient = get!(world, (game_id, 2), Ingredient);
        assert(ingredient.count == 0, 'count not initially 0');

        let result = world.execute('Forage', build_calldata(game_id, Region::Forest));

        // post conditions
        let ingredient = get!(world, (game_id, 2), Ingredient);
        assert(ingredient.count == 1, 'failed to add ingredient');
    }

    fn build_calldata(game_id: u128, region: Region) -> Array<felt252> {
        let mut forage_calldata = array![];
        Serde::serialize(@0x0, ref forage_calldata);
        Serde::serialize(@Region::Forest, ref forage_calldata);
        forage_calldata
    }
}