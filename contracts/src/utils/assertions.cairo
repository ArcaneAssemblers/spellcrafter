
use dojo::world::Context;
use dojo::world::IWorldDispatcherTrait;
use spellcrafter::components::Owner;

fn assert_caller_is_owner(ctx: Context, entity_id: u128) {
    let owner = get!(ctx.world, entity_id, Owner);
    assert(owner.address == ctx.origin, 'Only the owner can interact');
}
