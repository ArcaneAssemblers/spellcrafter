#!/usr/bin/python
import contextlib
from math import ceil
from typing import Tuple

from PIL import Image as PILImage
from PIL.Image import Image

from card.card import Card
from param.config_enums import ImageLayout
from util.helpers import Helpers as h


class Deck:
    DEFAULT_MAX_WIDTH = 10

    def __init__(self, name: str, config: dict):
        self._name = name
        self._cards: list[Card] = list()
        self._back = None
        self._layout = (
            h.dont_require(config, "output/image_layout") or ImageLayout.SHEET
        )
        self._padding = h.dont_require(config, "output/padding")
        self._scaling = h.dont_require(config, "output/scaling")
        self._padding_color = (
            h.dont_require(config, "output/padding_colorstring") or "#000000"
        )
        self._sheet_max_width = (
            h.dont_require(config, "output/sheet_max_width") or Deck.DEFAULT_MAX_WIDTH
        )

    def get_size(self):
        return len(self._cards)

    def get_name(self):
        return self._name

    def get_dimensions(self) -> Tuple[int, int]:
        width = min(self._sheet_max_width, self.get_size())
        height = ceil(self.get_size() / width)
        return (width, height)

    def add_card(self, card: Card):
        self._cards.append(card)

    def set_back(self, back: Card):
        self._back = back

    def has_back(self) -> bool:
        return not not self._back

    def render(self) -> list[Image]:
        return (
            self._render_singletons()
            if self._layout == ImageLayout.SINGLETON
            else self._render_sheets()
        )

    def render_back(self) -> Image:
        return self._back.render()

    def _render_sheets(self) -> list[Image]:
        num_cards = len(self._cards)
        if num_cards == 0:
            return []

        (num_w, num_h) = self.get_dimensions()
        card_index = 0
        deck_image = None
        for y in range(num_h):
            for x in range(num_w):
                if card_index == len(self._cards):
                    break

                card = self._cards[card_index]
                card_index = card_index + 1

                with contextlib.closing(self._render_card(card)) as card_image:
                    if deck_image is None:
                        x_step = card_image.width
                        y_step = card_image.height
                        deck_pix_w = card_image.width * num_w
                        deck_pix_h = card_image.height * num_h
                        deck_image = PILImage.new("RGBA", (deck_pix_w, deck_pix_h))

                    deck_image.paste(
                        im=card_image,
                        box=(
                            x * x_step,
                            y * y_step,
                            (x + 1) * x_step,
                            (y + 1) * y_step,
                        ),
                    )

        return [deck_image]

    def _render_singletons(self) -> list[Image]:
        num_cards = len(self._cards)
        if num_cards == 0:
            return []
        result = []
        for card_index in range(num_cards):
            card = self._cards[card_index]
            result.append(self._render_card(card))
        return result

    def _render_card(self, card: Card) -> Image:
        image = card.render()
        for fn in [self._scale, self._pad]:
            image = self._then_close(fn, image)

        return image

    def _then_close(self, fn, closable):
        with contextlib.closing(closable):
            return fn(closable)

    def _pad(self, card_image: Image) -> Image:
        if self._padding is None:
            return card_image.copy()

        padded_image = PILImage.new(
            "RGBA",
            (
                int(card_image.width + 2 * self._padding[0]),
                int(card_image.height + 2 * self._padding[1]),
            ),
            color=self._padding_color,
        )
        padded_image.paste(card_image, (int(self._padding[0]), int(self._padding[1])))
        return padded_image

    def _scale(self, card_image: Image) -> Image:
        if self._scaling is None:
            return card_image.copy()

        return card_image.resize(
            (
                int(card_image.width * self._scaling[0]),
                int(card_image.height * self._scaling[1]),
            )
        )
