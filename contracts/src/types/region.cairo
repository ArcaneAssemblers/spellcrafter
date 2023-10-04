#[derive(Copy, Drop, Serde, SerdeLen)]
enum Region {
    Forest: (),
    Meadow: (),
    Volcano: (),
    Cave: (),
}
