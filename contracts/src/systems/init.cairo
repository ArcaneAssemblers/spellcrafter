#[system]
mod init {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;

    use spellcrafter::components::spell;

    fn execute(ctx: Context) {
        set!(
            ctx.world,
            (
                spell::initialize(ctx.origin, ctx.world.uuid())
            )
        );
        return ();
    }
}
