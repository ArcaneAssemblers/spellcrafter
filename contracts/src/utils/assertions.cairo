
use dojo::world::Context;
use dojo::world::IWorldDispatcherTrait;
use spellcrafter::components::Owner;
use spellcrafter::cards::actions::is_dead;

fn assert_caller_is_owner(ctx: Context, entity_id: u128) {
    let owner = get!(ctx.world, entity_id, Owner);
    assert(owner.address == ctx.origin, 'Only the owner can interact');
}

fn assert_is_alive(ctx: Context, game_id: u128) {
    assert(!is_dead(ctx, game_id), 'player is dead, game over');
}
