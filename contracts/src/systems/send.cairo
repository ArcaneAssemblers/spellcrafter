#[system]
mod Send {
    use traits::Into;
    use box::BoxTrait;
    use dojo::world::Context;

    use spellcrafter::constants::{TICKS_PER_SEND, TICKS};
    use spellcrafter::utils::assertions::{assert_caller_is_owner, assert_is_alive, assert_is_unoccupied, assert_is_familiar};
    use spellcrafter::cards::actions::{increase_stat, stat_meets_threshold, tick};
    use spellcrafter::types::{FamiliarType, FamiliarTypeTrait, Action};
    use spellcrafter::components::{ValueInGame, Occupied};

    // Send an unoccupied familiar to forage
    fn execute(ctx: Context, game_id: u128, entity_id: u128) {
        assert_caller_is_owner(ctx, game_id);
        assert_is_alive(ctx, game_id);
        assert_is_familiar(ctx, game_id, entity_id);
        assert_is_unoccupied(ctx, game_id, entity_id);

        let currentTicks = get!(ctx.world, (TICKS, game_id), ValueInGame).value;

        set!(
            ctx.world,
            (
                Occupied { entity_id, until: currentTicks + TICKS_PER_SEND, doing: 0 }, // TODO: Make familiars do their default action based on type
            )
        );
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

        // summon a familiar
        let result = world.execute('Summon', build_calldata(game_id, 0));
        let entity_id: u128 = (*result[0]).try_into().unwrap();

        // send it!
        world.execute('Send', build_calldata(game_id, entity_id));
    }

    fn build_calldata(game_id: u128, entity_id: u128) -> Array<felt252> {
        let mut calldata = array![];
        Serde::serialize(@game_id, ref calldata);
        Serde::serialize(@entity_id, ref calldata);
        calldata
    }
}
