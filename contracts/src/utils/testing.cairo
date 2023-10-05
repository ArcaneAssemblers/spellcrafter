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
    value_in_game::value_in_game,
    occupied::occupied
};

// used to spawn a test world with all the components and systems registered
fn initialize_world() -> IWorldDispatcher {

    let mut models = array![
        owner::TEST_CLASS_HASH,
        value_in_game::TEST_CLASS_HASH,
        occupied::TEST_CLASS_HASH,
    ];
    
    spawn_test_world(models)
}
