#[system]
mod ReapActions {
    use traits::Into;
    use box::BoxTrait;
    use dojo::world::Context;

    use spellcrafter::constants::{CHAOS_STAT};
    use spellcrafter::components::{Occupied};
    use spellcrafter::utils::assertions::{assert_caller_is_owner, assert_is_alive, assert_is_unoccupied};
    use spellcrafter::cards::actions::{increase_stat};

    // Claim a number of concluded actions that an entity has completed
    // and execute them to apply the result to the game
    fn execute(ctx: Context, game_id: u128, entity_id: u128) {
        assert_caller_is_owner(ctx, game_id);
        assert_is_alive(ctx, game_id);

        assert_is_unoccupied(ctx, game_id, entity_id); // action must have completed
        let occupation = get!(ctx.world, entity_id, Occupied);
        
        // todo!();
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

    use spellcrafter::types::{FamiliarType, FamiliarTypeTrait};
    use spellcrafter::utils::testing::initialize_world;
    use spellcrafter::components::{Owner, ValueInGame};
    use spellcrafter::constants::{FAMILIARS_HELD, FAMILIAR_LIMIT};


    #[test]
    #[available_gas(300000000000)]
    fn send() {
        let world = initialize_world();        
        let result = world.execute('NewGame', array![]);
        let game_id: u128 = (*result[0]).try_into().unwrap();

        // time travel some number of ticks forward
        let result = world.execute('TimeTravel', build_calldata(game_id, 4));
    }

    fn build_calldata(game_id: u128, ticks: u32) -> Array<felt252> {
        let mut calldata = array![];
        Serde::serialize(@game_id, ref calldata);
        Serde::serialize(@ticks, ref calldata);
        calldata
    }
}
