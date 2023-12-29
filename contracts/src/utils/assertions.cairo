use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use spellcrafter::components::{Owner, Occupied, Familiar, Valueingame};
use spellcrafter::cards::actions::is_dead;
use spellcrafter::constants::{TICKS, RAVENS, CATS, SALAMANDERS, WOLF_SPIDERS};
use spellcrafter::types::familiar::FamiliarType;

fn assert_caller_is_owner(world: IWorldDispatcher, caller: ContractAddress, entity_id: u128) {
    let owner = get!(world, entity_id, Owner);
    assert(owner.address == caller, 'Only the owner can interact');
}

fn assert_is_alive(world: IWorldDispatcher, game_id: u128) {
    assert(!is_dead(world, game_id), 'player is dead, game over');
}

fn assert_is_unoccupied(world: IWorldDispatcher, game_id: u128, entity_id: u128) {
    let occupied = get!(world, entity_id, Occupied);
    let time = get!(world, (TICKS, game_id), Valueingame);
    assert(occupied.until < time.value, 'entity is occupied');
}

// ensure an entitiy ID belongs to an familiar in this game
fn assert_is_familiar(world: IWorldDispatcher, game_id: u128, entity_id: u128) {
    let familiar = get!(world, entity_id, Familiar);
    assert(
        familiar.familiar_type == FamiliarType::Raven || 
        familiar.familiar_type == FamiliarType::Cat || 
        familiar.familiar_type == FamiliarType::Salamander || 
        familiar.familiar_type == FamiliarType::WolfSpider,
     'entity not a familiar');
    assert(familiar.game_id == game_id, 'entity not in this game');
}