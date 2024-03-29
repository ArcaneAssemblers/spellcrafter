/// Game Params ///

const INITIAL_BARRIERS: u32 = 3;
const CHAOS_PER_FORAGE: u32 = 3;
const ITEM_LIMIT: u32 = 7;
const FAMILIAR_LIMIT: u32 = 1;
const BARRIERS_LIMIT: u32 = 3;

// How many ticks each kind of action takes
const TICKS_PER_FORAGE: u32 = 2;
const TICKS_PER_SUMMON: u32 = 5;
const TICKS_PER_SEND: u32 = 2;
const CHAOS_PER_TICK: u32 = 1;

/// Valid IDs ///

// ensure these dont collide with card ids
const CHAOS_STAT: u128 = 10000;
const POWER_STAT: u128 = 10001;
const BARRIERS_STAT: u128 = 10002;
const ITEMS_HELD: u128 = 10003;
const FAMILIARS_HELD: u128 = 10004;
const TICKS: u128 = 10005;

// this is zero for stats that can go +/-
const POLAR_STAT_MIDPOINT: u32 = 2_147_483_647;

// polar stats
const HOTCOLD_STAT: u128 = 20004;
const LIGHTDARK_STAT: u128 = 20005;

// familiars
const RAVENS: u128 = 30001;
const CATS: u128 = 30002;
const SALAMANDERS: u128 = 30003;
const WOLF_SPIDERS: u128 = 30004;
