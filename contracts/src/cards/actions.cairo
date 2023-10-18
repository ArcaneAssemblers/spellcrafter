use option::OptionTrait;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use spellcrafter::components::ValueInGame;
use spellcrafter::cards::properties::{
    consumable, chaos_delta, power_delta, hotcold_delta, lightdark_delta, requires_cold_gt,
    requires_hot_gt, requires_light_gt, requires_dark_gt, chaos_delta_fallback,
    power_delta_fallback, hotcold_delta_fallback, lightdark_delta_fallback
};
use spellcrafter::constants::{CHAOS_STAT, POWER_STAT, HOTCOLD_STAT, LIGHTDARK_STAT, BARRIERS_STAT, POLAR_STAT_MIDPOINT};


// modify the game state as demanded by this card
fn enact_card(world: IWorldDispatcher, game_id: u128, card_id: u128) {
    if (polar_stat_meets_threshold(world, game_id, HOTCOLD_STAT, requires_hot_gt::get(card_id), false)
        && polar_stat_meets_threshold(world, game_id, HOTCOLD_STAT, requires_cold_gt::get(card_id), true)
        && polar_stat_meets_threshold(world, game_id, LIGHTDARK_STAT, requires_light_gt::get(card_id), false)
        && polar_stat_meets_threshold(world, game_id, LIGHTDARK_STAT, requires_dark_gt::get(card_id), true)) {
        make_primary_stat_changes(world, game_id, card_id);
    } else {
        make_fallback_stat_changes(world, game_id, card_id);
    }

    // consume the card if it is consumable
    match consumable::get(card_id) {
        Option::Some(b) => {
            if b {
                consume(world, game_id, card_id);
            }
        },
        Option::None(_) => {},
    }
}

fn make_primary_stat_changes(world: IWorldDispatcher, game_id: u128, card_id: u128) {
    match chaos_delta::get(card_id) {
        Option::Some(delta) => {
            alter_stat(world, game_id, CHAOS_STAT, delta);
        },
        Option::None => {},
    }
    match power_delta::get(card_id) {
        Option::Some(delta) => {
            alter_stat(world, game_id, POWER_STAT, delta);
        },
        Option::None => {},
    }
    match hotcold_delta::get(card_id) {
        Option::Some(delta) => {
            alter_stat(world, game_id, HOTCOLD_STAT, delta);
        },
        Option::None => {},
    }
    match lightdark_delta::get(card_id) {
        Option::Some(delta) => {
            alter_stat(world, game_id, LIGHTDARK_STAT, delta);
        },
        Option::None => {},
    }
}

fn make_fallback_stat_changes(world: IWorldDispatcher, game_id: u128, card_id: u128) {
    match chaos_delta_fallback::get(card_id) {
        Option::Some(delta) => {
            alter_stat(world, game_id, CHAOS_STAT, delta);
        },
        Option::None => {},
    }
    match power_delta_fallback::get(card_id) {
        Option::Some(delta) => {
            alter_stat(world, game_id, POWER_STAT, delta);
        },
        Option::None => {},
    }
    match hotcold_delta_fallback::get(card_id) {
        Option::Some(delta) => {
            alter_stat(world, game_id, HOTCOLD_STAT, delta);
        },
        Option::None => {},
    }
    match lightdark_delta_fallback::get(card_id) {
        Option::Some(delta) => {
            alter_stat(world, game_id, LIGHTDARK_STAT, delta);
        },
        Option::None => {},
    }
}

fn bust_barrier(world: IWorldDispatcher, game_id: u128) {
    decrease_stat(world, game_id, BARRIERS_STAT, 1);
}

fn is_dead(world: IWorldDispatcher, game_id: u128) -> bool {
    let value = get!(world, (BARRIERS_STAT, game_id), ValueInGame).value;
    value == 0
}

// increase the value of the stat given by stat_id by delta
fn alter_stat(world: IWorldDispatcher, game_id: u128, stat_id: u128, delta: (u32, bool)) {
    let (delta, is_negative) = delta;
    if is_negative {
        decrease_stat(world, game_id, stat_id, delta);
    } else {
        increase_stat(world, game_id, stat_id, delta);
    }
}

// increase the value of the stat given by stat_id by delta
fn increase_stat(world: IWorldDispatcher, game_id: u128, stat_id: u128, delta: u32) {
    let value = get!(world, (stat_id, game_id), ValueInGame).value;
    // TODO: guard for overflows
    set!(
        world,
        ValueInGame { entity_id: stat_id, game_id, value: value + delta }
    );
}

// decrease the value of the stat given by stat_id by delta
fn decrease_stat(world: IWorldDispatcher, game_id: u128, stat_id: u128, delta: u32) {
    let value = get!(world, (stat_id, game_id), ValueInGame).value;
    let result_value = if delta >= value {
        0 // clamp at zero to avoid underflow panics
    } else {
        value - delta
    };
    set!(
        world,
        ValueInGame { entity_id: stat_id, game_id, value: result_value }
    );
}

// increase the value of the stat given by stat_id by delta
fn stat_meets_threshold(
    world: IWorldDispatcher, game_id: u128, stat_id: u128, threshold: Option<(u32, bool)>
) -> bool {
    match threshold {
        Option::Some((threshold, is_negative)) => {
            if is_negative {
                // this can never be met and is as bug
                return false;
            }
            let value = get!(world, (stat_id, game_id), ValueInGame).value;
            value >= threshold
        },
        Option::None => {
            true
        },
    }
}

// increase the value of the stat given by stat_id by delta
fn polar_stat_meets_threshold(
    world: IWorldDispatcher, game_id: u128, stat_id: u128, threshold: Option<(u32, bool)>, reverse: bool
) -> bool {
    match threshold {
        Option::Some((threshold, is_negative)) => {
            let value = get!(world, (stat_id, game_id), ValueInGame).value;
            if is_negative && !reverse || !is_negative && reverse {
                value <= POLAR_STAT_MIDPOINT - threshold
            } else {
                value >= POLAR_STAT_MIDPOINT + threshold
            }
        },
        Option::None => {
            true
        },
    }
}

// consume a single instance of a card
fn consume(world: IWorldDispatcher, game_id: u128, card_id: u128) {
    let value = get!(world, (card_id, game_id), ValueInGame);
    set!(
        world,
        ValueInGame { entity_id: card_id, game_id: value.game_id, value: value.value - 1 }
    );
}
