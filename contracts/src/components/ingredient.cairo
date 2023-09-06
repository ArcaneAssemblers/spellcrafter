// Ingredients are items required to peform certain actions
// they are locked to a particular game, and have a given type
// A game can have multiple in-hand as determined by the `count` field
#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Ingredient {
    #[key]
    entity_id: u128,
    #[key]
    ingredient_type: u32,
    count: u32,
}
