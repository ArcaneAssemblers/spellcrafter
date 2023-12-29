use spellcrafter::constants::{RAVENS, CATS, SALAMANDERS, WOLF_SPIDERS};
use spellcrafter::types::{Action, ActionTrait};

#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
enum FamiliarType {
    Raven,
    Cat,
    Salamander,
    WolfSpider,
}

#[generate_trait]
impl ImplFamiliarType of FamiliarTypeTrait {
    fn default_action_id(self: FamiliarType) -> u8 {
        match self {
            FamiliarType::Raven => Action::ForageForest.id(),
            FamiliarType::Cat => Action::ForageMeadow.id(),
            FamiliarType::Salamander => Action::ForageVolcano.id(),
            FamiliarType::WolfSpider => Action::ForageCave.id(),
        }
    }
}