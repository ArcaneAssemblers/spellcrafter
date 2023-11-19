use spellcrafter::constants::{RAVENS, CATS, SALAMANDERS, WOLF_SPIDERS};
use spellcrafter::types::{Action, ActionTrait};

#[derive(Serde, Copy, Drop, Introspect)]
enum FamiliarType {
    Raven: (),
    Cat: (),
    Salamanger: (),
    WolfSpider: (),
}

#[generate_trait]
impl ImplFamiliarType of FamiliarTypeTrait {
    fn stat_id(self: FamiliarType) -> u128 {
        match self {
            FamiliarType::Raven => RAVENS,
            FamiliarType::Cat => CATS,
            FamiliarType::Salamanger => SALAMANDERS,
            FamiliarType::WolfSpider => WOLF_SPIDERS,
        }
    }

    fn default_action_id(self: FamiliarType) -> u8 {
        match self {
            FamiliarType::Raven => Action::ForageForest.id(),
            FamiliarType::Cat => Action::ForageMeadow.id(),
            FamiliarType::Salamanger => Action::ForageVolcano.id(),
            FamiliarType::WolfSpider => Action::ForageCave.id(),
        }
    }
}