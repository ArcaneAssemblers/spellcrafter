
use spellcrafter::types::Region;
use spellcrafter::utils::random::rand_int_in_range;

fn random_card_from_region(seed: felt252, region: Region) -> u128 {
    rand_int_in_range(seed, 0, 10)
}
