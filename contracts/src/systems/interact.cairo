#[system]
mod Interact {
    use traits::Into;
    use dojo::world::Context;
    use spellcrafter::components::{ValueInGame};
    use spellcrafter::utils::assert_caller_is_owner;
    use spellcrafter::cards::actions::enact_card;

    fn execute(ctx: Context, game_id: u128, item_id: u128) {
        assert_caller_is_owner(ctx, game_id);
        
        let owned = get!(ctx.world, (item_id, game_id), ValueInGame).value;
        assert(owned > 0, 'Item is not owned');

        enact_card(ctx, game_id, item_id);
    }
}
