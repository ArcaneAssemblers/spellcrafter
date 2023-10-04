#[system]
mod NewGame {
    use traits::Into;
    use dojo::world::Context;

    use spellcrafter::constants::{INITIAL_BARRIERS, BARRIERS_STAT, HOTCOLD_STAT, LIGHTDARK_STAT, POLAR_STAT_MIDPOINT};
    use spellcrafter::components::{Owner, ValueInGame};

    fn execute(ctx: Context) -> u128 {
        let game_id: u128 = ctx.world.uuid().into();
        set!(
            ctx.world,
            (
                Owner { entity_id: game_id, address: ctx.origin },
                ValueInGame { entity_id: BARRIERS_STAT, game_id, value: INITIAL_BARRIERS },
                ValueInGame { entity_id: HOTCOLD_STAT, game_id, value: POLAR_STAT_MIDPOINT },
                ValueInGame { entity_id: LIGHTDARK_STAT, game_id, value: POLAR_STAT_MIDPOINT },
            )
        );
        game_id
    }
}
