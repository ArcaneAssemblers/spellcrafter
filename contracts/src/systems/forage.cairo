use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use spellcrafter::types::Region;

#[starknet::interface]
trait IForage<TContractState> {
    fn forage(self: @TContractState, world: IWorldDispatcher, game_id: u128, region: Region) -> u128;
}

#[system]
mod forage {
    use traits::Into;
    use box::BoxTrait;
    use starknet::get_caller_address;

    use spellcrafter::types::Region;
    use spellcrafter::constants::{CHAOS_STAT, ITEMS_HELD, CHAOS_PER_FORAGE, ITEM_LIMIT};
    use spellcrafter::components::{Owner, ValueInGame};
    use spellcrafter::utils::assertions::{assert_caller_is_owner, assert_is_alive};
    use spellcrafter::cards::selection::random_card_from_region;
    use spellcrafter::cards::actions::{increase_stat, stat_meets_threshold};

    // In the context of a particular game, forage in a given region
    // This will add a random spell component to the players hand
    #[external(v0)]
    fn forage(self: @ContractState, world: IWorldDispatcher, game_id: u128, region: Region) -> u128 {
        assert_caller_is_owner(world, get_caller_address(), game_id);
        assert_is_alive(world, game_id);
        assert(!stat_meets_threshold(world, game_id, ITEMS_HELD, Option::Some((ITEM_LIMIT, false))), 'Too many items held');
        
        // TODO This is not simulation safe. Ok for quick protyping only
        let tx_info = starknet::get_tx_info().unbox();
        let seed = tx_info.transaction_hash;

        let card_id = random_card_from_region(seed, region);

        // increase chaos by a fixed amount. In the future this will be a function of time
        increase_stat(world, game_id, CHAOS_STAT, CHAOS_PER_FORAGE);
        // increase the number of that card
        increase_stat(world, game_id, card_id, 1);
        // increase the total number of items held
        increase_stat(world, game_id, ITEMS_HELD, 1);

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
    use dojo::test_utils::deploy_contract;

    use spellcrafter::types::Region;
    use spellcrafter::utils::testing::initialize_world;
    use spellcrafter::components::{Owner, ValueInGame};
    use spellcrafter::systems::new_game::{new_game, INewGameDispatcher, INewGameDispatcherTrait};
    use spellcrafter::constants::{ITEMS_HELD, ITEM_LIMIT};

    use super::{forage, IForageDispatcher, IForageDispatcherTrait};

    #[test]
    #[available_gas(300000000000)]
    fn test_forage() {
        let world = initialize_world();   

        // deploy systems contract
        let contract_address = deploy_contract(new_game::TEST_CLASS_HASH, array![].span());
        let new_game_system = INewGameDispatcher { contract_address };

        let contract_address = deploy_contract(forage::TEST_CLASS_HASH, array![].span());
        let forage_system = IForageDispatcher { contract_address };

        let game_id = new_game_system.new_game(world);
        let card_id = forage_system.forage(world, game_id, Region::Forest);

        // post conditions
        let card = get!(world, (card_id, game_id), ValueInGame);
        assert(card.value == 1, 'failed to add ingredient');
    }

    #[test]
    #[available_gas(300000000000)]
    #[should_panic(expected: ('Too many items held', 'ENTRYPOINT_FAILED') )]
    fn cannot_exceed_max_items() {
        let world = initialize_world();   

        // deploy systems contract
        let contract_address = deploy_contract(new_game::TEST_CLASS_HASH, array![].span());
        let new_game_system = INewGameDispatcher { contract_address };

        let contract_address = deploy_contract(forage::TEST_CLASS_HASH, array![].span());
        let forage_system = IForageDispatcher { contract_address };

        let game_id = new_game_system.new_game(world);

        // // pre conditions
        let items = get!(world, (ITEMS_HELD, game_id), ValueInGame).value;
        assert(items == 0, 'not initially no items');

        let mut i = 0;
        loop {
            if i >= ITEM_LIMIT {
                break;
            }
            forage_system.forage(world, game_id, Region::Forest);
            i += 1;
        };

        // post conditions
        let items = get!(world, (ITEMS_HELD, game_id), ValueInGame).value;
        assert(items == ITEM_LIMIT, 'not expected n_items');

        // should fail
        forage_system.forage(world, game_id, Region::Forest);
    }
}
