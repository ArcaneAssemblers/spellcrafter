/// An action that an entity can be performing while time passes
#[derive(Serde, Copy, Drop)]
enum Action {
    None: (),
    ForageForest: (),
    ForageMeadow: (),
    ForageVolcano: (),
    ForageCave: (),
}

#[generate_trait]
impl ImplAction of ActionTrait {
    fn id(self: Action) -> u8 {
        match self {
            Action::None => 0,
            Action::ForageForest => 1,
            Action::ForageMeadow => 2,
            Action::ForageVolcano => 3,
            Action::ForageCave => 4,
        }
    }
}
