use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[starknet::interface]
trait INewGame<TContractState> {
    fn new_game(self: @TContractState, world: IWorldDispatcher) -> u128;
}

#[system]
mod new_game {
    use traits::Into;
    use starknet::get_caller_address;

    use spellcrafter::constants::{INITIAL_BARRIERS, BARRIERS_STAT, HOTCOLD_STAT, LIGHTDARK_STAT, POLAR_STAT_MIDPOINT};
    use spellcrafter::components::{Owner, ValueInGame};

    #[external(v0)]
    fn new_game(self: @ContractState, world: IWorldDispatcher) -> u128 {
        let game_id: u128 = world.uuid().into();
        set!(
            world,
            (
                Owner { entity_id: game_id, address: get_caller_address() }
            )
        );
        set!(
            world,
            (
                ValueInGame { entity_id: BARRIERS_STAT, game_id, value: INITIAL_BARRIERS }
            )
        );
        set!(
            world,
            (
                ValueInGame { entity_id: HOTCOLD_STAT, game_id, value: POLAR_STAT_MIDPOINT }
            )
        );
        set!(
            world,
            (
                ValueInGame { entity_id: LIGHTDARK_STAT, game_id, value: POLAR_STAT_MIDPOINT }
            )
        );
        game_id
    }
}
