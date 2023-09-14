use option::OptionTrait;
use dojo::world::Context;
use dojo::world::IWorldDispatcherTrait;

use spellcrafter::components::ValueInGame;
use spellcrafter::cards::properties::{consumable, chaos_delta};

const CHAOS_STAT: u128 = 0;

// modify the game state as demanded by this card
fn enact_card(ctx: Context, game_id: u128, card_id: u128) {
    // iterate through each of the actions that a card can have and apply the if relevent
    match chaos_delta::get(card_id) {
        Option::Some(delta) => { increase_stat(ctx, game_id, CHAOS_STAT, 1); },
        Option::None => {},
    }

    match consumable::get(card_id) {
        Option::Some(b) => {
            if b { consume(ctx, game_id, card_id); }
        },
        Option::None(_) => {},
    }
}

// increase the value of the stat given by stat_id by delta
fn increase_stat(ctx: Context, game_id: u128, stat_id: u128, delta: u32) {
    let value = get!(ctx.world, (stat_id, game_id), ValueInGame);
    set!(ctx.world, ValueInGame {
        entity_id: stat_id,
        game_id: value.game_id,
        value: value.value + delta
    });
}

// consume a single instance of a card
fn consume(ctx: Context, game_id: u128, card_id: u128) {
    let value = get!(ctx.world, (card_id, game_id), ValueInGame);
    set!(ctx.world, ValueInGame {
        entity_id: card_id,
        game_id: value.game_id,
        value: value.value - 1
    });
}
