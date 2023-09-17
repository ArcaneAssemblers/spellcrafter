use integer::{u128s_from_felt252, U128sFromFelt252Result};
use poseidon::poseidon_hash_span;
use array::ArrayTrait;

// Using the given seed return a random value between min and max inclusive
fn rand_int_in_range(seed: felt252, min: u128, max: u128) -> u128 {
    let mut serialized = ArrayTrait::new();
    serialized.append(seed);

    let val = match u128s_from_felt252(poseidon_hash_span(serialized.span())) {
        U128sFromFelt252Result::Narrow(x) => x,
        U128sFromFelt252Result::Wide((x, _)) => x,
    };

    let range = max - min + 1; // + 1 to include max
    min + val % (max - min)
}
