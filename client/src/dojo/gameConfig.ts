
export enum SpellStats {
    Chaos = 10000,
    Power = 10001,
    HotCold = 10002,
    LightDark = 10003,
    Barriers = 10004,
};

export const SpellStatsDisplay: { [key in SpellStats]: string } = {
    [SpellStats.Chaos]: "Chaos",
    [SpellStats.Power]: "Power",
    [SpellStats.HotCold]: "Hot/Cold",
    [SpellStats.LightDark]: "Light/Dark",
    [SpellStats.Barriers]: "Barriers",
};
