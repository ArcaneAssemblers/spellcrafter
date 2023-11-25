use spellcrafter::types::action::Action;

// Represents an entity that is occupied until a given timestamp
#[derive(Model, Copy, Drop, Serde)]
struct Occupied {
    #[key]
    entity_id: u128,
    until: u32,
    doing: Action,
}
