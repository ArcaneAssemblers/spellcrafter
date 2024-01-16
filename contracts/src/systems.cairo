use spellcrafter::types::{Region, FamiliarType};

#[starknet::interface]
trait ISpellCrafter<TContractState> {
    fn new_game(self: @TContractState) -> u128;
    fn forage(self: @TContractState, game_id: u128, region: Region) -> u128;
    fn interact(self: @TContractState, game_id: u128, item_id: u128);
    fn summon(self: @TContractState, game_id: u128, familiar_type: FamiliarType) -> u128;
    fn sacrifice(self: @TContractState, game_id: u128, familiar_id: u128);
    fn send(self: @TContractState, game_id: u128, familiar_id: u128);
    fn reap_action(self: @TContractState, game_id: u128, entity_id: u128) -> u128;
    fn wait(self: @TContractState, game_id: u128);
}

#[dojo::contract]
mod spellcrafter_system {
    use super::ISpellCrafter;
    use starknet::{get_caller_address};
    use core::zeroable::Zeroable;
    use spellcrafter::constants::{
        INITIAL_BARRIERS, BARRIERS_STAT, HOTCOLD_STAT, LIGHTDARK_STAT, POLAR_STAT_MIDPOINT,
        CHAOS_STAT, ITEMS_HELD, TICKS_PER_FORAGE, ITEM_LIMIT, FAMILIAR_LIMIT, FAMILIARS_HELD,
        TICKS_PER_SUMMON, BARRIERS_LIMIT, TICKS, TICKS_PER_SEND,
    };
    use spellcrafter::types::{Region, FamiliarType, FamiliarTypeTrait, Action};
    use spellcrafter::components::{Owner, Valueingame, Familiar, Occupied};
    use spellcrafter::utils::assertions::{
        assert_caller_is_owner, assert_is_alive, assert_is_familiar, assert_is_unoccupied
    };
    use spellcrafter::utils::random::pass_check;
    use spellcrafter::cards::selection::random_card_from_region;
    use spellcrafter::cards::actions::{
        increase_stat, decrease_stat, stat_meets_threshold, enact_card, is_dead, bust_barrier, tick,
        increase_stat_clamped, draw_from_region
    };

    #[external(v0)]
    impl SpellCrafterImpl of ISpellCrafter<ContractState> {
        fn new_game(self: @ContractState) -> u128 {
            let world = self.world_dispatcher.read();
            let game_id: u128 = world.uuid().into();
            set!(
                world,
                (
                    Owner { entity_id: game_id, address: get_caller_address() },
                    Valueingame { entity_id: BARRIERS_STAT, game_id, value: INITIAL_BARRIERS },
                    Valueingame { entity_id: HOTCOLD_STAT, game_id, value: POLAR_STAT_MIDPOINT },
                    Valueingame { entity_id: LIGHTDARK_STAT, game_id, value: POLAR_STAT_MIDPOINT }
                )
            );
            game_id
        }

        // In the context of a particular game, forage in a given region
        // This will add a random spell component to the players hand
        fn forage(self: @ContractState, game_id: u128, region: Region) -> u128 {
            let world = self.world_dispatcher.read();
            assert_caller_is_owner(world, get_caller_address(), game_id);
            assert_is_alive(world, game_id);

            let card_id = draw_from_region(world, game_id, region);

            // increase chaos by a fixed amount. In the future this will be a function of time
            tick(world, game_id, TICKS_PER_FORAGE);

            // TODO This is not simulation safe. Ok for quick protyping only
            let tx_info = starknet::get_tx_info().unbox();
            let seed = tx_info.transaction_hash;
            let chaos = get!(world, (CHAOS_STAT, game_id), Valueingame).value;
            if !pass_check(seed, chaos) {
                bust_barrier(world, game_id);
            }

            return card_id;
        }

        // Place a card owned by the player in this game into the spell
        fn interact(self: @ContractState, game_id: u128, item_id: u128) {
            let world = self.world_dispatcher.read();
            assert_caller_is_owner(world, get_caller_address(), game_id);
            assert_is_alive(world, game_id);

            // TODO This is not simulation safe. Ok for quick protyping only
            let tx_info = starknet::get_tx_info().unbox();
            let seed = tx_info.transaction_hash;

            let owned = get!(world, (item_id, game_id), Valueingame).value;
            assert(owned > 0, 'Item is not owned');

            enact_card(world, game_id, item_id);
        }

        // summon a familiar which can be sent to retrieve items. Returns the entity ID of the familiar
        fn summon(self: @ContractState, game_id: u128, familiar_type: FamiliarType) -> u128 {
            let world = self.world_dispatcher.read();
            assert_caller_is_owner(world, get_caller_address(), game_id);
            assert_is_alive(world, game_id);
            assert(
                !stat_meets_threshold(
                    world, game_id, FAMILIARS_HELD, Option::Some((FAMILIAR_LIMIT, false))
                ),
                'Too many familiars'
            );
            // Move time forward, also increase chaos
            tick(world, game_id, TICKS_PER_SUMMON);

            // TODO This is not simulation safe. Ok for quick protyping only
            let tx_info = starknet::get_tx_info().unbox();
            let seed = tx_info.transaction_hash;
            let chaos = get!(world, (CHAOS_STAT, game_id), Valueingame).value;
            if !pass_check(seed, chaos) {
                bust_barrier(world, game_id);
            }

            if !is_dead(world, game_id) {
                // create a new entity for the familiar
                let entity_id: u128 = world.uuid().into();
                set!(
                    world,
                    (
                        Familiar { entity_id, game_id, familiar_type },
                        Owner { entity_id, address: get_caller_address() },
                    )
                );

                // increase the total number of familiars held in this game
                increase_stat(world, game_id, FAMILIARS_HELD, 1);
                return entity_id;
            }
            return 0;
        }

        // Sacrifice a familiar to rebuild one barrier
        fn sacrifice(self: @ContractState, game_id: u128, familiar_id: u128) {
            let world = self.world_dispatcher.read();
            assert_caller_is_owner(world, get_caller_address(), game_id);
            assert_is_alive(world, game_id);
            assert_is_familiar(world, game_id, familiar_id); // can only sacrifice familiar entities
            assert_caller_is_owner(
                world, get_caller_address(), familiar_id
            ); // can only sacrifice familiars you own
            assert_is_unoccupied(
                world, game_id, familiar_id
            ); // can only sacrifice them if they are unoccupied

            // set the owner of a familiar to the zero address to mark it as sacrificed
            set!(world, (Owner { entity_id: familiar_id, address: Zeroable::zero() },));

            increase_stat_clamped(world, game_id, BARRIERS_STAT, 1, BARRIERS_LIMIT);
            decrease_stat(world, game_id, FAMILIARS_HELD, 1);
        }

        // Send a familiar to forage
        fn send(self: @ContractState, game_id: u128, familiar_id: u128) {
            let world = self.world_dispatcher.read();
            assert_caller_is_owner(world, get_caller_address(), game_id);
            assert_is_alive(world, game_id);
            assert_is_familiar(world, game_id, familiar_id); // can only send familiar entities
            assert_caller_is_owner(
                world, get_caller_address(), familiar_id
            ); // can only send familiars you own
            assert_is_unoccupied(
                world, game_id, familiar_id
            ); // can only send them if they are unoccupied

            let current_ticks = get!(world, (TICKS, game_id), Valueingame).value;

            set!(
                world,
                (
                    Occupied {
                        entity_id: familiar_id,
                        until: current_ticks + TICKS_PER_SEND,
                        doing: Action::ForageForest,
                        reaped: false
                    }, // TODO: Make familiars do their default action based on type
                )
            );
        }

        // Reap a completed action
        fn reap_action(self: @ContractState, game_id: u128, entity_id: u128) -> u128 {
            let world = self.world_dispatcher.read();
            assert_caller_is_owner(world, get_caller_address(), game_id);

            let occupied = get!(world, entity_id, Occupied);

            assert(occupied.reaped == false, 'Action already reaped');
            assert(
                occupied.until <= get!(world, (TICKS, game_id), Valueingame).value,
                'Action not complete'
            );

            let region = match occupied.doing {
                Action::None => {
                    assert(0 == 1, 'cannot enact None action');
                    Region::Cave // Unreachable. Required to make return types match.
                },
                Action::ForageForest => { Region::Forest },
                Action::ForageMeadow => { Region::Meadow },
                Action::ForageVolcano => { Region::Volcano },
                Action::ForageCave => { Region::Cave },
            };

            let card_id = draw_from_region(world, game_id, region);

            // ensure action cannot be reaped again
            set!(world, (Occupied { entity_id, until: 0, doing: Action::None, reaped: true },));

            card_id
        }

        // wait one tick in the game
        fn wait(self: @ContractState, game_id: u128) {
            let world = self.world_dispatcher.read();
            assert_caller_is_owner(world, get_caller_address(), game_id);
            assert_is_alive(world, game_id);

            tick(world, game_id, 1);
        }
    }
}


#[cfg(test)]
mod forage_tests {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use spellcrafter::types::Region;
    use spellcrafter::utils::testing::{deploy_game, SpellcraftDeployment};
    use spellcrafter::components::{Owner, Valueingame};
    use spellcrafter::constants::{ITEMS_HELD, ITEM_LIMIT};

    use super::{spellcrafter_system, ISpellCrafterDispatcher, ISpellCrafterDispatcherTrait};

    #[test]
    #[available_gas(300000000000)]
    fn test_forage() {
        let SpellcraftDeployment{world, system, } = deploy_game();

        let game_id = system.new_game();
        let card_id = system.forage(game_id, Region::Forest);

        // post conditions
        let card = get!(world, (card_id, game_id), Valueingame);
        assert(card.value == 1, 'failed to add ingredient');
    }

    #[test]
    #[available_gas(300000000000)]
    #[should_panic(expected: ('Too many items held', 'ENTRYPOINT_FAILED'))]
    fn cannot_exceed_max_items() {
        let SpellcraftDeployment{world, system } = deploy_game();

        let game_id = system.new_game();

        // // pre conditions
        let items = get!(world, (ITEMS_HELD, game_id), Valueingame).value;
        assert(items == 0, 'not initially no items');

        let mut i = 0;
        loop {
            if i >= ITEM_LIMIT {
                break;
            }
            system.forage(game_id, Region::Forest);
            i += 1;
        };

        // post conditions
        let items = get!(world, (ITEMS_HELD, game_id), Valueingame).value;
        assert(items == ITEM_LIMIT, 'not expected n_items');

        // should fail
        system.forage(game_id, Region::Forest);
    }
}

#[cfg(test)]
mod interact_tests {
    use traits::{Into, TryInto};
    use result::ResultTrait;
    use array::ArrayTrait;
    use option::OptionTrait;
    use serde::Serde;

    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::test_utils::deploy_contract;

    use spellcrafter::utils::testing::{deploy_game, SpellcraftDeployment};
    use spellcrafter::components::{Owner, Valueingame};

    use super::{spellcrafter_system, ISpellCrafterDispatcher, ISpellCrafterDispatcherTrait};

    #[test]
    #[should_panic(expected: ('Item is not owned', 'ENTRYPOINT_FAILED'))]
    #[available_gas(300000000000)]
    fn reverts_if_card_not_owned() {
        let CARD_ID: u128 = 1;

        let SpellcraftDeployment{world, system, } = deploy_game();

        let game_id = system.new_game();
        system.interact(game_id, CARD_ID);
    }

    #[test]
    #[available_gas(300000000000)]
    fn works_if_card_owned() {
        let CARD_ID: u128 = 1;

        let SpellcraftDeployment{world, system } = deploy_game();

        let game_id = system.new_game();

        set!(world, Valueingame { entity_id: CARD_ID, game_id: game_id, value: 1 });
        system.interact(game_id, CARD_ID);
    }
}

#[cfg(test)]
mod summon_tests {
    use traits::{Into, TryInto};
    use result::ResultTrait;
    use array::ArrayTrait;
    use option::OptionTrait;
    use serde::Serde;

    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::test_utils::deploy_contract;

    use spellcrafter::utils::testing::{deploy_game, SpellcraftDeployment};
    use spellcrafter::components::{Owner, Valueingame, Familiar};
    use spellcrafter::types::{FamiliarType, FamiliarTypeTrait};
    use spellcrafter::constants::{FAMILIARS_HELD, FAMILIAR_LIMIT};

    use super::{spellcrafter_system, ISpellCrafterDispatcher, ISpellCrafterDispatcherTrait};

    #[test]
    #[available_gas(300000000000)]
    fn can_summon_on_new_game() {
        let SpellcraftDeployment{world, system } = deploy_game();
        let game_id = system.new_game();
        let familiar_entity_id = system.summon(game_id, FamiliarType::Cat);

        // post conditions
        let familiar = get!(world, (familiar_entity_id), Familiar);
        assert(familiar.familiar_type == FamiliarType::Cat, 'familiar type not set');
        let familiars_held = get!(world, (FAMILIARS_HELD, game_id), Valueingame).value;
        assert(familiars_held == 1, 'familiars_held not incremented');
    }

    #[test]
    #[should_panic(expected: ('Too many familiars', 'ENTRYPOINT_FAILED'))]
    #[available_gas(300000000000)]
    fn cannot_exceed_limit() {
        let SpellcraftDeployment{world, system } = deploy_game();
        let game_id = system.new_game();

        let mut i = 0;
        loop {
            if i >= FAMILIAR_LIMIT {
                break;
            }
            system.summon(game_id, FamiliarType::Raven);
            i += 1;
        };

        // post conditions
        let familiars_held = get!(world, (FAMILIARS_HELD, game_id), Valueingame).value;
        assert(familiars_held == 1, 'familiars_held not incremented');

        // should panic
        system.summon(game_id, FamiliarType::Raven);
    }
}

#[cfg(test)]
mod sacrifice_tests {
    use traits::{Into, TryInto};
    use result::ResultTrait;
    use array::ArrayTrait;
    use option::OptionTrait;
    use serde::Serde;

    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::test_utils::deploy_contract;

    use spellcrafter::utils::testing::{deploy_game, SpellcraftDeployment};
    use spellcrafter::components::{Owner, Valueingame, Familiar};
    use spellcrafter::types::{FamiliarType, FamiliarTypeTrait};
    use spellcrafter::constants::{FAMILIARS_HELD, FAMILIAR_LIMIT, BARRIERS_STAT, INITIAL_BARRIERS};
    use spellcrafter::cards::actions::bust_barrier;

    use super::{spellcrafter_system, ISpellCrafterDispatcher, ISpellCrafterDispatcherTrait};

    #[test]
    #[available_gas(300000000000)]
    fn can_summon_then_sacrifice() {
        let SpellcraftDeployment{world, system } = deploy_game();
        let game_id = system.new_game();
        let familiar_entity_id = system.summon(game_id, FamiliarType::Cat);
        system.sacrifice(game_id, familiar_entity_id);

        let familiars_held = get!(world, (FAMILIARS_HELD, game_id), Valueingame).value;
        assert(familiars_held == 0, 'familiars_held not incremented');
    }

    #[test]
    #[available_gas(300000000000)]
    fn sacrificing_rebuilds_barrier() {
        let SpellcraftDeployment{world, system } = deploy_game();
        let game_id = system.new_game();
        bust_barrier(world, game_id);

        // pre conditions
        let barriers = get!(world, (BARRIERS_STAT, game_id), Valueingame).value;
        assert(barriers == INITIAL_BARRIERS - 1, 'did not bust barrier');

        let familiar_entity_id = system.summon(game_id, FamiliarType::Cat);
        system.sacrifice(game_id, familiar_entity_id);

        // post conditions
        let familiars_held = get!(world, (FAMILIARS_HELD, game_id), Valueingame).value;
        let barriers = get!(world, (BARRIERS_STAT, game_id), Valueingame).value;
        assert(barriers == INITIAL_BARRIERS, 'barrier not rebuild');
        assert(familiars_held == 0, 'familiars_held not incremented');

        // cannot build barriers past
        let familiar_entity_id = system.summon(game_id, FamiliarType::Cat);
        system.sacrifice(game_id, familiar_entity_id);
        let barriers = get!(world, (BARRIERS_STAT, game_id), Valueingame).value;
        assert(barriers == INITIAL_BARRIERS, 'barrier count not clamped');
    }
}

#[cfg(test)]
mod send_tests {
    use traits::{Into, TryInto};
    use result::ResultTrait;
    use array::ArrayTrait;
    use option::OptionTrait;
    use serde::Serde;

    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::test_utils::deploy_contract;

    use spellcrafter::utils::testing::{deploy_game, SpellcraftDeployment};
    use spellcrafter::components::{Valueingame, Familiar, Occupied};
    use spellcrafter::types::{FamiliarType, FamiliarTypeTrait};
    use spellcrafter::constants::{
        FAMILIARS_HELD, FAMILIAR_LIMIT, BARRIERS_STAT, INITIAL_BARRIERS, TICKS, TICKS_PER_SEND
    };

    use super::{spellcrafter_system, ISpellCrafterDispatcher, ISpellCrafterDispatcherTrait};

    #[test]
    #[available_gas(300000000000)]
    fn can_summon_then_send() {
        let SpellcraftDeployment{ world, system } = deploy_game();
        let game_id = system.new_game();
        let familiar_entity_id = system.summon(game_id, FamiliarType::Cat);
        system.send(game_id, familiar_entity_id);

        let occupied = get!(world, familiar_entity_id, Occupied);
        let time = get!(world, (TICKS, game_id), Valueingame);
        assert(occupied.until == time.value + TICKS_PER_SEND, 'entity is occupied');
    }
}

#[cfg(test)]
mod reap_action_tests {
    use traits::{Into, TryInto};
    use result::ResultTrait;
    use array::ArrayTrait;
    use option::OptionTrait;
    use serde::Serde;

    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::test_utils::deploy_contract;

    use spellcrafter::utils::testing::{deploy_game, SpellcraftDeployment};
    use spellcrafter::components::{Valueingame, Familiar, Occupied};
    use spellcrafter::types::{FamiliarType, FamiliarTypeTrait};
    use spellcrafter::constants::{
        FAMILIARS_HELD, FAMILIAR_LIMIT, BARRIERS_STAT, INITIAL_BARRIERS, TICKS, TICKS_PER_SEND, TICKS_PER_FORAGE,
    };

    use super::{spellcrafter_system, ISpellCrafterDispatcher, ISpellCrafterDispatcherTrait};

    #[test]
    #[available_gas(300000000000)]
    fn can_reap_an_action() {
        let SpellcraftDeployment{ world, system } = deploy_game();
        let game_id = system.new_game();
        let familiar_entity_id = system.summon(game_id, FamiliarType::Cat);
        system.send(game_id, familiar_entity_id);
        let mut i = 0;
        loop {
            if i >= TICKS_PER_FORAGE {
                break;
            }
            system.wait(game_id);
            i += 1;
        };
        let card_id = system.reap_action(game_id, familiar_entity_id);
    }
}