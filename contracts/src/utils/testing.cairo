use dojo::{executor::executor, world::{world, IWorldDispatcher, IWorldDispatcherTrait}};
use dojo::test_utils::spawn_test_world;

use starknet::{
    syscalls::deploy_syscall,
    class_hash::Felt252TryIntoClassHash, 
    get_caller_address, ClassHash
};

use traits::{Into, TryInto};
use result::ResultTrait;
use array::ArrayTrait;
use option::OptionTrait;

use spellcrafter::components::{
    owner::owner,
    spell::spell,
    ingredient::ingredient,
    occupied::occupied
};
use spellcrafter::systems::{
    Init,
    Forage
};

// used to spawn a test world with all the components and systems registered
fn initialize_world() -> IWorldDispatcher {

    let mut components = array![
        owner::TEST_CLASS_HASH,
        spell::TEST_CLASS_HASH,
        ingredient::TEST_CLASS_HASH,
        occupied::TEST_CLASS_HASH,
    ];

    let mut systems = array![
        Init::TEST_CLASS_HASH,
        Forage::TEST_CLASS_HASH,
    ];
    
    spawn_test_world(components, systems)
}