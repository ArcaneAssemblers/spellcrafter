use array::ArrayTrait;
use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Spell {
    #[key]
    owner: ContractAddress,
    #[key]
    id: usize,

    barriers: u8,
    power: u32,
    chaos: u32,
    hot_cold: u32,
    light_dark: u32,
}

fn initialize(owner: ContractAddress, id: usize) -> Spell {
    Spell {
        owner,
        id,
        barriers: 3,
        power: 0,
        chaos: 0,
        hot_cold: 0,
        light_dark: 0,
    }
}
