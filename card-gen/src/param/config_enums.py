#!/usr/bin/python
from enum import Enum

class CardBuilderType(str, Enum):
    BASIC = "basic"


class CardLayerType(str, Enum):
    STATIC_TEXT = "static_text"
    TEXT = "text"
    EMBEDDED_TEXT = "embedded_text"
    STATIC_IMAGE = "static_image"
    IMAGE = "image"
    SYMBOL_ROW = "symbol_row"


class InputProviderType(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"


class OutputProviderType(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"


class Orientation(str, Enum):
    HORIZONTAL = "horizontal"
    VERTICAL = "vertical"


class VerticalAlignment(str, Enum):
    TOP = "top"
    MIDDLE = "middle"
    BOTTOM = "bottom"


class HorizontalAlignment(str, Enum):
    LEFT = "left"
    CENTER = "center"
    RIGHT = "right"


class ImageLayout(str, Enum):
    SHEET = "sheet"
    SINGLETON = "singleton"
