use spellcrafter::types::familiar::FamiliarType;

// Represents an entity that is a familiar
#[derive(Model, Copy, Drop, Serde)]
struct Familiar {
    #[key]
    entity_id: u128,
    game_id: u128,
    familiar_type: FamiliarType,
}
