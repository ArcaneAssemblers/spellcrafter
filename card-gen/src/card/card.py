#!/usr/bin/python
import PIL.Image

from layer.card_layer import CardLayer
from util.placement import Placement


class Card:
    def __init__(self, w: int, h: int):
        self._w = w
        self._h = h
        self._layers: list[CardLayer] = list()

    def get_placement(self) -> Placement:
        return Placement(0, 0, self._w, self._h)

    def add_layer(self, layer: CardLayer):
        self._layers.append(layer)

    def add_layers(self, layers: list[CardLayer]):
        self._layers.extend(layers)

    def render(self) -> PIL.Image.Image:
        image = PIL.Image.new("RGBA", (int(self._w), int(self._h)))

        for layer in self._layers:
            layer.render(image)

        return image
