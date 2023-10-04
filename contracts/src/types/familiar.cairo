use spellcrafter::constants::{RAVENS, CATS, SALAMANDERS, WOLF_SPIDERS};

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
enum Familiar {
    Raven: (),
    Cat: (),
    Salamanger: (),
    WolfSpider: (),
}

#[generate_trait]
impl ImplFamiliar of FamiliarTrait {
    fn stat_id(self: Familiar) -> u128 {
        match self {
            Familiar::Raven => RAVENS,
            Familiar::Cat => CATS,
            Familiar::Salamanger => SALAMANDERS,
            Familiar::WolfSpider => WOLF_SPIDERS,
        }
    }
}
