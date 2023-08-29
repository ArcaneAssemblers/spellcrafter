#!/usr/bin/python
from enum import StrEnum


class CardBuilderType(StrEnum):
    BASIC = "basic"


class CardLayerType(StrEnum):
    STATIC_TEXT = "static_text"
    TEXT = "text"
    EMBEDDED_TEXT = "embedded_text"
    STATIC_IMAGE = "static_image"
    IMAGE = "image"
    SYMBOL_ROW = "symbol_row"


class InputProviderType(StrEnum):
    LOCAL = "local"
    GOOGLE = "google"


class OutputProviderType(StrEnum):
    LOCAL = "local"
    GOOGLE = "google"


class Orientation(StrEnum):
    HORIZONTAL = "horizontal"
    VERTICAL = "vertical"


class VerticalAlignment(StrEnum):
    TOP = "top"
    MIDDLE = "middle"
    BOTTOM = "bottom"


class HorizontalAlignment(StrEnum):
    LEFT = "left"
    CENTER = "center"
    RIGHT = "right"


class ImageLayout(StrEnum):
    SHEET = "sheet"
    SINGLETON = "singleton"
