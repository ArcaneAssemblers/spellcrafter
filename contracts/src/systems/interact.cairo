#[system]
mod Interact {
    use traits::Into;
    use dojo::world::Context;
    use spellcrafter::components::{Owner};
    use spellcrafter::utils::assert_caller_is_owner;

    fn execute(ctx: Context, game_id: u128) -> u128 {
        assert_caller_is_owner(ctx, game_id);

        let entity_id: u128 = ctx.world.uuid().into();
        set!(
            ctx.world,
            (
                Owner { entity_id, address: ctx.origin }
            )
        );
        entity_id
    }
}
