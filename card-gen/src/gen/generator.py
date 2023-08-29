#!/usr/bin/python

import contextlib
from abc import ABC

from PIL.Image import Image

from card.card_builder import CardBuilder
from deck.deck import Deck
from deck.deck_builder import DeckBuilder
from param.input_parameters import InputParameters
from provider.input_provider import InputProvider
from provider.output_provider import OutputProvider


class Generator(ABC):
    @staticmethod
    def gen_deck(params: InputParameters, input_provider: InputProvider) -> Deck:
        card_builder = CardBuilder(params.config)
        deck_builder = DeckBuilder(card_builder, params.config)
        decklist = input_provider.get_decklist(params.decklist)
        deck = deck_builder.build(params.deck_name, decklist)
        return deck

    @staticmethod
    def gen_and_save_images(
        deck: Deck,
        output_provider: OutputProvider,
    ) -> list[str]:
        def _save_and_close(img: Image, name: str) -> str:
            with contextlib.closing(img) as i:
                return output_provider.save_image(i, name)

        front_images = deck.render()
        deck_name = deck.get_name()
        front_files = list(
            map(
                _save_and_close,
                front_images,
                [
                    Generator._get_image_name(deck_name, i)
                    for i in range(len(front_images))
                ],
            )
        )
        back_image = deck.render_back() if deck.has_back() else None
        back_file = (
            _save_and_close(back_image, deck_name + "_back.png") if back_image else None
        )
        return (front_files, back_file)

    @staticmethod
    def _get_image_name(deck_name: str, index: int) -> str:
        return deck_name + "_" + str(index) + ".png"
