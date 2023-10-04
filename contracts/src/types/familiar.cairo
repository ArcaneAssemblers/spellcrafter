use spellcrafter::constants::{RAVENS, CATS, SALAMANDERS, WOLF_SPIDERS};

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
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
}
