#[system]
mod Summon {
    use traits::Into;
    use box::BoxTrait;
    use dojo::world::Context;

    use spellcrafter::constants::{FAMILIARS_HELD, TICKS_PER_SUMMON, FAMILIAR_LIMIT};
    use spellcrafter::utils::assertions::{assert_caller_is_owner, assert_is_alive};
    use spellcrafter::cards::actions::{increase_stat, stat_meets_threshold, tick};
    use spellcrafter::types::{FamiliarType, FamiliarTypeTrait};
    use spellcrafter::components::{Familiar, Owner};

    // In the context of a particular game, summon a familiar
    // Adds a familiar of the chosen type to the players hand
    fn execute(ctx: Context, game_id: u128, familiar_type: FamiliarType) -> u128 {
        assert_caller_is_owner(ctx, game_id);
        assert_is_alive(ctx, game_id);
        assert(!stat_meets_threshold(ctx, game_id, FAMILIARS_HELD, Option::Some((FAMILIAR_LIMIT, false))), 'Too many familiars');
        
        // Move time forward, also increase chaos
        tick(ctx, game_id, TICKS_PER_SUMMON);

        // create a new entity for the familiar
        let entity_id: u128 = ctx.world.uuid().into();
        set!(
            ctx.world,
            (
                Familiar { entity_id, game_id, familiar_type_id: familiar_type.stat_id() },
                Owner { entity_id, address: ctx.origin },
            )
        );

        // increase the total number of familiars held in this game
        increase_stat(ctx, game_id, FAMILIARS_HELD, 1);

        return entity_id;
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
    fn summon() {
        let world = initialize_world();        
        let result = world.execute('NewGame', array![]);
        let game_id: u128 = (*result[0]).try_into().unwrap();

        let result = world.execute('Summon', build_calldata(game_id, FamiliarType::Cat));
        let entity_id: u128 = (*result[0]).try_into().unwrap();

        // post conditions
        let familiars = get!(world, (FAMILIARS_HELD, game_id), ValueInGame);
        let owner = get!(world, (entity_id), Owner);

        assert(familiars.value == 1, 'failed to summon');
        assert(owner.address == world.origin(), 'owner not the calling address');
    }

    #[test]
    #[available_gas(300000000000)]
    #[should_panic(expected: ('Too many familiars', 'ENTRYPOINT_FAILED', 'ENTRYPOINT_FAILED', 'ENTRYPOINT_FAILED') )]
    fn cannot_exceed_max_items() {
        let world = initialize_world();        
        let result = world.execute('NewGame', array![]);
        let game_id: u128 = (*result[0]).try_into().unwrap();

        // pre conditions
        let familiars = get!(world, (FAMILIARS_HELD, game_id), ValueInGame).value;
        assert(familiars == 0, 'not initially no familiars');

        let mut i = 0;
        loop {
            if i >= FAMILIAR_LIMIT {
                break;
            }
            world.execute('Summon', build_calldata(game_id, FamiliarType::Cat));
            i += 1;
        };

        // post conditions
        let familiars = get!(world, (FAMILIARS_HELD, game_id), ValueInGame).value;
        assert(familiars == FAMILIAR_LIMIT, 'not expected n_familiars');

        // should fail
        world.execute('Summon', build_calldata(game_id, FamiliarType::Cat));
    }

    fn build_calldata(game_id: u128, familiar_type: FamiliarType) -> Array<felt252> {
        let mut calldata = array![];
        Serde::serialize(@game_id, ref calldata);
        Serde::serialize(@familiar_type, ref calldata);
        calldata
    }
}
