use dojo::{executor::executor, world::{world, IWorldDispatcher, IWorldDispatcherTrait}};
use dojo::test_utils::spawn_test_world;

use starknet::{
    syscalls::deploy_syscall,
    class_hash::Felt252TryIntoClassHash, 
    get_caller_address, ClassHash
};

use traits::{Into, TryInto};
use core::array::SpanTrait;
use result::ResultTrait;
use array::ArrayTrait;
use option::OptionTrait;

use spellcrafter::components::{
    owner::owner,
    value_in_game::value_in_game,
    occupied::occupied
};
use spellcrafter::systems::{spellcrafter_system, ISpellCrafterDispatcher};

struct SpellcraftDeployment {
    world: IWorldDispatcher,
    system: ISpellCrafterDispatcher,
}

// used to spawn a test world with all the components and systems registered
fn deploy_game() -> SpellcraftDeployment {

    let mut models = array![
        owner::TEST_CLASS_HASH,
        value_in_game::TEST_CLASS_HASH,
        occupied::TEST_CLASS_HASH,
    ];
    
    let world = spawn_test_world(models);

    // deploy systems contract
    let contract_address = world.deploy_contract('yummysalt', spellcrafter_system::TEST_CLASS_HASH.try_into().unwrap());
    let system = ISpellCrafterDispatcher { contract_address };

    SpellcraftDeployment {
        world,
        system,
    }
}
