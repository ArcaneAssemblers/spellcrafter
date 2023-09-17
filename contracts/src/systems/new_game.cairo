#[system]
mod NewGame {
    use traits::Into;
    use dojo::world::Context;

    use spellcrafter::constants::{INITIAL_BARRIERS, BARRIERS_STAT};
    use spellcrafter::components::{Owner, ValueInGame};

    fn execute(ctx: Context) -> u128 {
        let game_id: u128 = ctx.world.uuid().into();
        set!(
            ctx.world,
            (
                Owner { entity_id: game_id, address: ctx.origin }
            )
        );
        set!(
            ctx.world,
            (
                ValueInGame { entity_id: BARRIERS_STAT, game_id, value: INITIAL_BARRIERS }
            )
        );
        game_id
    }
}
