#!/usr/bin/python
from dataclasses import dataclass


@dataclass
class Placement:
    x: int
    y: int
    w: int
    h: int


def parse_placement(raw: dict) -> Placement:
    return Placement(raw.get("x"), raw.get("y"), raw.get("w"), raw.get("h"))


def copy_placement(p: Placement) -> Placement:
    return Placement(p.x, p.y, p.w, p.h)


def move_placement(dx: int, dy: int, p: Placement) -> Placement:
    return Placement(p.x + dx, p.y + dy, p.w, p.h)


# box is defined as left, top, right, bottom pixel coordinates


def to_box(p: Placement) -> tuple[int, int, int, int]:
    return (p.x, p.y, p.x + p.w, p.y + p.h)


def from_box(box: tuple[int, int, int, int]) -> Placement:
    return Placement(box[0], box[1], box[2] - box[0], box[3] - box[1])
