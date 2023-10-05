use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use spellcrafter::components::Owner;
use spellcrafter::cards::actions::is_dead;

fn assert_caller_is_owner(world: IWorldDispatcher, caller: ContractAddress, entity_id: u128) {
    let owner = get!(world, entity_id, Owner);
    assert(owner.address == caller, 'Only the owner can interact');
}

fn assert_is_alive(world: IWorldDispatcher, game_id: u128) {
    assert(!is_dead(world, game_id), 'player is dead, game over');
}
