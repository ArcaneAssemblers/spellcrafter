#[derive(Serde, Copy, Drop, Introspect)]
enum Region {
    Forest: (),
    Meadow: (),
    Volcano: (),
    Cave: (),
}
