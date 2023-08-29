#!/usr/bin/python
import os
from abc import ABC
from typing import Optional

from layer.card_layer import CardLayer
from layer.image_card_layers import BasicImageLayer, SymbolRowImageLayer
from layer.text_card_layers import EmbeddedImageTextCardLayer
from param.config_enums import CardLayerType
from provider.input_provider import InputProvider
from util.helpers import Helpers as h
from util.placement import *


class CardLayerFactory(ABC):
    @staticmethod
    def build(
        layer_configs: list[dict],
        config: dict,
        card: dict[str, str],
        input_provider: InputProvider,
    ) -> list[CardLayer]:
        layers: list[CardLayer] = []

        for layer_config in layer_configs:
            layer_type: CardLayerType = layer_config.get("type")

            if layer_type == CardLayerType.STATIC_TEXT:
                layers.append(
                    EmbeddedImageTextCardLayer(
                        h.require(layer_config, "text"),
                        parse_placement(h.require(layer_config, "place")),
                        input_provider,
                        # optional
                        max_font_size=layer_config.get("max_font_size")
                        or h.dont_require(config, "text/max_font_size"),
                        font_file=CardLayerFactory._get_font_file(config, layer_config),
                        spacing_ratio=layer_config.get("spacing_ratio")
                        or h.dont_require(config, "text/spacing_ratio"),
                        v_alignment=layer_config.get("v_alignment"),
                        h_alignment=layer_config.get("h_alignment"),
                        color=layer_config.get("color")
                        or h.dont_require(config, "text/color"),
                    )
                )

            elif layer_type == CardLayerType.TEXT:
                layers.append(
                    EmbeddedImageTextCardLayer(
                        h.require(card, h.require(layer_config, "prop")),
                        parse_placement(h.require(layer_config, "place")),
                        input_provider,
                        # optional params
                        max_font_size=layer_config.get("max_font_size")
                        or h.dont_require(config, "text/max_font_size"),
                        font_file=CardLayerFactory._get_font_file(config, layer_config),
                        spacing_ratio=layer_config.get("spacing_ratio")
                        or h.dont_require(config, "text/spacing_ratio"),
                        v_alignment=layer_config.get("v_alignment"),
                        h_alignment=layer_config.get("h_alignment"),
                        color=layer_config.get("color")
                        or h.dont_require(config, "text/color"),
                    )
                )

            elif layer_type == CardLayerType.EMBEDDED_TEXT:
                layers.append(
                    EmbeddedImageTextCardLayer(
                        h.require(card, h.require(layer_config, "prop")),
                        parse_placement(h.require(layer_config, "place")),
                        input_provider,
                        # optional params
                        embedding_map=h.require(config, "text/embed_symbol_id_map"),
                        max_font_size=layer_config.get("max_font_size")
                        or h.dont_require(config, "text/max_font_size"),
                        font_file=CardLayerFactory._get_font_file(config, layer_config),
                        spacing_ratio=layer_config.get("spacing_ratio")
                        or h.dont_require(config, "text/spacing_ratio"),
                        v_alignment=layer_config.get("v_alignment"),
                        h_alignment=None,  # alignment not compatible with embedded image placement
                        embed_v_offset_ratio=layer_config.get("embed_v_offset_ratio")
                        or h.dont_require(config, "text/embed_v_offset_ratio"),
                        embed_size_ratio=layer_config.get("embed_size_ratio")
                        or h.dont_require(config, "text/embed_size_ratio"),
                        color=layer_config.get("color")
                        or h.dont_require(config, "text/color"),
                    )
                )

            elif layer_type == CardLayerType.STATIC_IMAGE:
                layers.append(
                    BasicImageLayer(
                        input_provider,
                        h.require(layer_config, "image"),
                        parse_placement(h.require(layer_config, "place")),
                    )
                )

            elif layer_type == CardLayerType.IMAGE:
                layers.append(
                    BasicImageLayer(
                        input_provider,
                        card.get(h.require(layer_config, "prop")),
                        parse_placement(h.require(layer_config, "place")),
                    )
                )

            elif layer_type == CardLayerType.SYMBOL_ROW:
                layers.append(
                    SymbolRowImageLayer(
                        input_provider,
                        card.get(h.require(layer_config, "prop")),
                        h.require(config, "symbols/id_map"),
                        parse_placement(h.require(layer_config, "place")),
                        # optional params
                        spacing=layer_config.get("spacing"),
                        orientation=layer_config.get("orientation"),
                        alignment=layer_config.get("alignment"),
                    )
                )

            else:
                raise Exception('Unsupported layer type "' + layer_type + '"')

        return layers

    @staticmethod
    def _get_font_file(
        config: dict,
        layer_config: dict,
    ) -> Optional[str]:
        font_file = layer_config.get("font_file") or h.dont_require(
            config, "text/font_file"
        )
        if font_file is None:
            return None
        assets_folder = config.get("local_assets_folder")
        if not os.path.isabs(font_file) and assets_folder is not None:
            return os.path.join(assets_folder, font_file)
        return font_file
