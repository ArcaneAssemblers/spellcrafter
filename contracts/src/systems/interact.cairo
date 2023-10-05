use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[starknet::interface]
trait IInteract<TContractState> {
    fn interact(self: @TContractState, world: IWorldDispatcher, game_id: u128, item_id: u128);
}

#[system]
mod interact {
    use traits::Into;
    use starknet::get_caller_address;
    use spellcrafter::components::{ValueInGame};
    use spellcrafter::utils::assertions::{assert_caller_is_owner, assert_is_alive};
    use spellcrafter::utils::random::pass_check;
    use spellcrafter::cards::actions::{enact_card, bust_barrier, is_dead};
    use spellcrafter::constants::{CHAOS_STAT};

    #[external(v0)]
    fn interact(self: @ContractState, world: IWorldDispatcher, game_id: u128, item_id: u128) {
        assert_caller_is_owner(world, get_caller_address(), game_id);
        assert_is_alive(world, game_id);

        // TODO This is not simulation safe. Ok for quick protyping only
        let tx_info = starknet::get_tx_info().unbox();
        let seed = tx_info.transaction_hash;

        let owned = get!(world, (item_id, game_id), ValueInGame).value;
        assert(owned > 0, 'Item is not owned');
        
        let chaos = get!(world, (CHAOS_STAT, game_id), ValueInGame).value;

        if !pass_check(seed, chaos) {
            bust_barrier(world, game_id);
        }

        if !is_dead(world, game_id) {
            enact_card(world, game_id, item_id);
        }
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
    use dojo::test_utils::deploy_contract;

    use spellcrafter::utils::testing::initialize_world;
    use spellcrafter::components::{Owner, ValueInGame};
    use spellcrafter::systems::new_game::{new_game, INewGameDispatcher, INewGameDispatcherTrait};
    use super::{interact, IInteractDispatcher, IInteractDispatcherTrait};

    #[test]
    #[should_panic(expected: ('Item is not owned', 'ENTRYPOINT_FAILED') )]
    #[available_gas(300000000000)]
    fn reverts_if_card_not_owned() {
        let CARD_ID: u128 = 1;

        let world = initialize_world();   

        // deploy systems contract
        let contract_address = deploy_contract(new_game::TEST_CLASS_HASH, array![].span());
        let new_game_system = INewGameDispatcher { contract_address };

        let contract_address = deploy_contract(interact::TEST_CLASS_HASH, array![].span());
        let interact_system = IInteractDispatcher { contract_address };

        let game_id = new_game_system.new_game(world);
        interact_system.interact(world, game_id, CARD_ID);
    }

    #[test]
    #[available_gas(300000000000)]
    fn works_if_card_owned() {
        let CARD_ID: u128 = 1;

        let world = initialize_world();   

        // deploy systems contract
        let contract_address = deploy_contract(new_game::TEST_CLASS_HASH, array![].span());
        let new_game_system = INewGameDispatcher { contract_address };

        let contract_address = deploy_contract(interact::TEST_CLASS_HASH, array![].span());
        let interact_system = IInteractDispatcher { contract_address };

        let game_id = new_game_system.new_game(world);

        set!(world, ValueInGame{ entity_id: CARD_ID, game_id: game_id, value: 1 });
        interact_system.interact(world, game_id, CARD_ID);
    }
}
