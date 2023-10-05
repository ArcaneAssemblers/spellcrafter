// The value of a particular property in the context of a game
#[derive(Model, Copy, Drop, Serde)]
struct ValueInGame {
    #[key]
    entity_id: u128,
    #[key]
    game_id: u128,
    value: u32,
}
