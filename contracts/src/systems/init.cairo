#[system]
mod Init {
    use traits::Into;
    use dojo::world::Context;

    use spellcrafter::constants::INITIAL_BARRIERS;
    use spellcrafter::components::{Owner, Spell};

    fn execute(ctx: Context) -> u128 {
        let entity_id: u128 = ctx.world.uuid().into();
        set!(
            ctx.world,
            (
                Owner { entity_id, address: ctx.origin },
                Spell {
                    entity_id,
                    barriers: INITIAL_BARRIERS,
                    power: 0,
                    chaos: 0,
                    hot_cold: 0,
                    light_dark: 0,
                },
            )
        );
        entity_id
    }
}
