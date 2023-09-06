#[derive(Component, Copy, Drop, Serde, SerdeLen)]
enum Region {
    Forest: (),
    Meadow: (),
    Volcano: (),
    Cave: (),
}
