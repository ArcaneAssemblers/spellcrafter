
use spellcrafter::types::Region;
use spellcrafter::utils::random::rand_int_in_range;
use spellcrafter::cards::properties::region_lookup;
use array::ArrayTrait;

fn random_card_from_region(seed: felt252, region: Region) -> u128 {
    let arr = match region {
        Region::Forest => region_lookup::forest(),
        Region::Meadow => region_lookup::meadow(),
        Region::Volcano => region_lookup::volcano(),
        Region::Cave => region_lookup::cave(),
    };
    // the unwrap here is safe as we know our value cannot exceed the array length
   *arr.at(rand_int_in_range(seed, 0, arr.len().into() - 1).try_into().unwrap())
}
