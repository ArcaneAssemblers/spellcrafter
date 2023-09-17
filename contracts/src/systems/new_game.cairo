#[system]
mod NewGame {
    use traits::Into;
    use dojo::world::Context;

    use spellcrafter::constants::INITIAL_BARRIERS;
    use spellcrafter::components::{Owner};

    fn execute(ctx: Context) -> u128 {
        let game_id: u128 = ctx.world.uuid().into();
        set!(
            ctx.world,
            (
                Owner { entity_id: game_id, address: ctx.origin }
            )
        );
        game_id
    }
}
