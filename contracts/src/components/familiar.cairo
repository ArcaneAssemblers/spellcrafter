
// Represents an entity that is a familiar
#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Familiar {
    #[key]
    entity_id: u128,
    familiar_type_id: u128,
}
