use dojo::{executor::executor, world::{world, IWorldDispatcher, IWorldDispatcherTrait}};
use dojo::test_utils::{spawn_test_world, deploy_contract};

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
use spellcrafter::systems::{
    new_game::{new_game, INewGameDispatcher},
    forage::{forage, IForageDispatcher},
    interact::{interact, IInteractDispatcher},
};

struct SpellcraftDeployment {
    world: IWorldDispatcher,
    new_game_system: INewGameDispatcher,
    forage_system: IForageDispatcher,
    interact_system: IInteractDispatcher,
}

// used to spawn a test world with all the components and systems registered
fn deploy_game() -> SpellcraftDeployment {

    let mut models = array![
        owner::TEST_CLASS_HASH,
        value_in_game::TEST_CLASS_HASH,
        occupied::TEST_CLASS_HASH,
    ];
    
    let world = spawn_test_world(models);

    let new_game_system = INewGameDispatcher { contract_address: deploy_contract(new_game::TEST_CLASS_HASH, array![].span()) };
    let forage_system = IForageDispatcher { contract_address: deploy_contract(forage::TEST_CLASS_HASH, array![].span()) };
    let interact_system = IInteractDispatcher { contract_address: deploy_contract(interact::TEST_CLASS_HASH, array![].span()) };

    SpellcraftDeployment {
        world,
        new_game_system,
        forage_system,
        interact_system,
    }
}
