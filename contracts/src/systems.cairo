
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use spellcrafter::types::Region;

#[starknet::interface]
trait ISpellCrafter<TContractState> {
    fn new_game(self: @TContractState, world: IWorldDispatcher) -> u128;
    fn forage(self: @TContractState, world: IWorldDispatcher, game_id: u128, region: Region) -> u128;
    fn interact(self: @TContractState, world: IWorldDispatcher, game_id: u128, item_id: u128);
}

#[system]
mod spellcrafter_systems {
    use traits::Into;
    use starknet::get_caller_address;

    use spellcrafter::constants::{INITIAL_BARRIERS, BARRIERS_STAT, HOTCOLD_STAT, LIGHTDARK_STAT, POLAR_STAT_MIDPOINT, CHAOS_STAT, ITEMS_HELD, CHAOS_PER_FORAGE, ITEM_LIMIT};
    use spellcrafter::types::Region;
    use spellcrafter::components::{Owner, ValueInGame};
    use spellcrafter::utils::assertions::{assert_caller_is_owner, assert_is_alive};
    use spellcrafter::utils::random::pass_check;
    use spellcrafter::cards::selection::random_card_from_region;
    use spellcrafter::cards::actions::{increase_stat, stat_meets_threshold, enact_card, is_dead, bust_barrier};

    #[external(v0)]
    fn new_game(self: @ContractState, world: IWorldDispatcher) -> u128 {
        let game_id: u128 = world.uuid().into();
        set!(
            world,
            (
                Owner { entity_id: game_id, address: get_caller_address() },
                ValueInGame { entity_id: BARRIERS_STAT, game_id, value: INITIAL_BARRIERS },
                ValueInGame { entity_id: HOTCOLD_STAT, game_id, value: POLAR_STAT_MIDPOINT },
                ValueInGame { entity_id: LIGHTDARK_STAT, game_id, value: POLAR_STAT_MIDPOINT }
            )
        );
        game_id
    }

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
