#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Quantity {
    #[key]
    entity_id: u128,
    value: u128,
}


#[generate_trait]
impl QuantityImpl of QuantityTrait {
    /// Get quantity value
    ///
    /// This should be used rather than accessing the value directly
    fn get_value(self: Quantity) -> u128 {
        if self.value > 0 {
            return self.value;
        }
        return 1;
    }
}
