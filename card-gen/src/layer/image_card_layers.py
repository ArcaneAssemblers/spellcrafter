#!/usr/bin/python
from typing import Optional

from PIL import Image

from layer.card_layer import CardLayer
from param.config_enums import HorizontalAlignment, Orientation, VerticalAlignment
from provider.input_provider import InputProvider
from util.placement import Placement, move_placement, to_box


class BasicImageLayer(CardLayer):
    def __init__(
        self, input_provider: InputProvider, art_id: str, art_placement: Placement
    ):
        self._input_provider = input_provider
        self._art_id = art_id
        self._art_placement = art_placement

    def render(self, onto: Image.Image):
        with self._input_provider.get_image(self._art_id) as image:
            w_ratio = image.width / self._art_placement.w
            h_ratio = image.height / self._art_placement.h
            if w_ratio <= h_ratio:
                w_resized = self._art_placement.w
                h_resized = int(image.height / w_ratio)
            else:
                w_resized = int(image.width / h_ratio)
                h_resized = self._art_placement.h

            with image.resize((w_resized, h_resized)) as resized:
                with resized.crop(
                    (0, 0, self._art_placement.w, self._art_placement.h)
                ) as cropped:
                    onto.paste(
                        im=cropped, box=to_box(self._art_placement), mask=cropped
                    )


class SymbolRowImageLayer(CardLayer):
    def __init__(
        self,
        input_provider: InputProvider,
        symbols: str,
        symbol_id_map: dict[str, str],
        initial_placement: Placement,
        spacing: Optional[int] = None,
        orientation: Optional[Orientation] = None,
        alignment: Optional[VerticalAlignment | HorizontalAlignment] = None,
    ):
        self._inner_layers: list[CardLayer] = []

        spacing = spacing or 0
        orientation = orientation or Orientation.HORIZONTAL
        alignment = alignment or HorizontalAlignment.LEFT
        symbols = symbols.strip().replace(" ", "")

        if orientation == Orientation.HORIZONTAL:
            if alignment == HorizontalAlignment.CENTER:
                for_symbols = int(len(symbols) / 2.0 * initial_placement.w)
                for_spacing = int((len(symbols) - 1) / 2 * spacing)
                offset = (-1 * (for_symbols + for_spacing), 0)
                shift = (spacing + initial_placement.w, 0)
            elif alignment == HorizontalAlignment.RIGHT:
                offset = (-1 * initial_placement.w, 0)
                shift = (-1 * (spacing + initial_placement.w), 0)
            else:
                offset = (0, 0)
                shift = (spacing + initial_placement.w, 0)
        else:
            if alignment == VerticalAlignment.MIDDLE:
                for_symbols = int(len(symbols) / 2.0 * initial_placement.h)
                for_spacing = int((len(symbols) - 1) / 2 * spacing)
                offset = (0, -1 * (for_symbols + for_spacing))
                shift = (0, spacing + initial_placement.h)
            elif alignment == VerticalAlignment.BOTTOM:
                offset = (0, -1 * initial_placement.h)
                shift = (0, -1 * (spacing + initial_placement.h))
            else:
                offset = (0, 0)
                shift = (0, spacing + initial_placement.h)

        place = move_placement(offset[0], offset[1], initial_placement)
        for symbol in symbols:
            self._inner_layers.append(
                BasicImageLayer(input_provider, symbol_id_map.get(symbol), place)
            )

            place = move_placement(shift[0], shift[1], place)

    def render(self, onto: Image.Image):
        for layer in self._inner_layers:
            layer.render(onto)
