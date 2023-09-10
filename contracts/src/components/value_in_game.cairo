// The value of a particular property in the context of a game
#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct ValueInGame {
    #[key]
    entity_id: u128,
    #[key]
    game_id: u128,
    value: u32,
}
