/// An action that an entity can be performing while time passes
#[derive(Copy, Drop, Serde, SerdeLen)]
enum Action {
    ForageForest: (),
    ForageMeadow: (),
    ForageVolcano: (),
    ForageCave: (),
}

#[generate_trait]
impl ImplAction of ActionTrait {
    fn id(self: Action) -> u8 {
        match self {
            Action::ForageForest => 0,
            Action::ForageMeadow => 1,
            Action::ForageVolcano => 2,
            Action::ForageCave => 3,
        }
    }
}
