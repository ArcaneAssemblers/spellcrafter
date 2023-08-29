#!/usr/bin/python
import argparse

from gen.generator import Generator
from param.input_parameters import InputParameterBuilder
from provider.input_provider import InputProviderFactory
from provider.output_provider import OutputProviderFactory
from util.helpers import Helpers as h

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--gen_config",
        type=str,
        required=True,
        help="Path to json-formatted generation configuration.",
    )
    parser.add_argument(
        "--deck_config",
        type=str,
        required=True,
        help="Path to json-formatted deck configuration.",
    )
    parser.add_argument(
        "--decklist",
        type=str,
        required=True,
        help="Path or name of the decklist to generate.",
    )
    parser.add_argument(
        "--tts", action="store_true", help="Flag to build and save a TTS deck object."
    )
    args = parser.parse_args()

    params = InputParameterBuilder.build(
        args.gen_config, args.deck_config, args.decklist
    )
    input_provider = InputProviderFactory.build(params.config)
    output_provider = OutputProviderFactory.build(params.config)

    deck = Generator.gen_deck(params, input_provider)
    (front_files, back_files) = Generator.gen_and_save_images(deck, output_provider)
    print("Saved deck images.")
