const INITIAL_BARRIERS: u32 = 3;
const TICKS_PER_FORAGE: u32 = 3;
const ITEM_LIMIT: u32 = 7;

// ensure these dont collide with card ids
const CHAOS_STAT: u128 = 10000;
const POWER_STAT: u128 = 10001;
const BARRIERS_STAT: u128 = 10002;
const ITEMS_HELD: u128 = 10003;

// this is zero for stats that can go +/-
const POLAR_STAT_MIDPOINT: u32 = 2_147_483_647;

// polar stats
const HOTCOLD_STAT: u128 = 10004;
const LIGHTDARK_STAT: u128 = 10005;

const TICKS: u128 = 10006;
