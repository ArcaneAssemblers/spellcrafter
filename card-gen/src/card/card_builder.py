#!/usr/bin/python

from card.card import Card
from layer.card_layer_factory import CardLayerFactory
from layer.image_card_layers import BasicImageLayer
from provider.input_provider import InputProviderFactory
from util.helpers import Helpers as h
from util.placement import Placement


class CardBuilder:
    def __init__(self, config: dict):
        self._input_provider = InputProviderFactory.build(config)

        self._default_type = h.require(config, "default_card_type")
        self._specs = h.require(config, "card_specs")
        if self._specs.get(self._default_type) == None:
            raise Exception("Invalid card_specs missing default type")

        self._w = h.require(config, "w")
        self._h = h.require(config, "h")

        self._config = config

    def build(self, card_info: dict[str, str]) -> Card:
        card = Card(self._w, self._h)
        card_type = card_info.get("card_type") or self._default_type
        layers = h.require(self._specs, card_type)
        card.add_layers(
            CardLayerFactory.build(
                layers, self._config, card_info, self._input_provider
            )
        )
        return card

    def build_back(self) -> Card:
        card = Card(self._w, self._h)
        card.add_layers(
            [
                BasicImageLayer(
                    self._input_provider,
                    h.require(self._config, "back_image"),
                    Placement(0, 0, self._w, self._h),
                )
            ]
        )
        return card
