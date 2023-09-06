
// Represents an entity that is occupied until a given timestamp
#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Occupied {
    #[key]
    entity_id: u128,
    until: u128,
}
