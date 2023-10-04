
use dojo::world::Context;
use dojo::world::IWorldDispatcherTrait;
use spellcrafter::components::{Owner, ValueInGame, Occupied, Familiar};
use spellcrafter::constants::{TICKS, RAVENS, CATS, SALAMANDERS, WOLF_SPIDERS};
use spellcrafter::cards::actions::is_dead;

fn assert_caller_is_owner(ctx: Context, entity_id: u128) {
    let owner = get!(ctx.world, entity_id, Owner);
    assert(owner.address == ctx.origin, 'Only the owner can interact');
}

fn assert_is_alive(ctx: Context, game_id: u128) {
    assert(!is_dead(ctx, game_id), 'player is dead, game over');
}

fn assert_is_unoccupied(ctx: Context, game_id: u128, entity_id: u128) {
    let occupied = get!(ctx.world, entity_id, Occupied);
    let time = get!(ctx.world, (TICKS, game_id), ValueInGame);
    assert(occupied.until < time.value, 'entity is occupied');
}

// ensure an entitiy ID belongs to an familiar in this game
fn assert_is_familiar(ctx: Context, game_id: u128, entity_id: u128) {
    let familiar = get!(ctx.world, entity_id, Familiar);
    let owner = get!(ctx.world, entity_id, Owner);
    assert(
        familiar.familiar_type_id == RAVENS || 
        familiar.familiar_type_id == CATS || 
        familiar.familiar_type_id == SALAMANDERS || 
        familiar.familiar_type_id == WOLF_SPIDERS,
     'entity not a familiar');
    assert(familiar.game_id == game_id, 'entity not in this game');
}
