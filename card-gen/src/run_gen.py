#!/usr/bin/python
import argparse

from gen.generator import Generator
from param.config_enums import OutputProviderType
from param.input_parameters import InputParameterBuilder
from provider.input_provider import InputProviderFactory
from provider.output_provider import OutputProviderFactory
from tts.tts_helper import TTSHelper
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

    if args.tts:
        if (
            len(front_files) != 1
            or not back_files
            or output_provider.TYPE != OutputProviderType.GOOGLE
        ):
            raise Exception(
                "Expected a single output image (sheet), a back image, and google drive output to generate TTS object."
            )

        tts_deck = TTSHelper.build_deck(
            deck.get_size(),
            deck.get_dimensions()[0],
            front_files[0],
            back_files,
        )
        tts_object_name = deck.get_name() + "_tts.json"
        output_provider.save_json(tts_deck, tts_object_name)

        tts_file = TTSHelper.save_object(
            tts_deck,
            tts_object_name,
            h.dont_require(params.config, "output/tts/saved_objects_folder"),
        )
        if not tts_file:
            print("Saved tts object to '" + tts_file + "'.")
        else:
            print(
                "Did not save tts object to saved objects folder. "
                + "Either the output/tts/saved_objects_folder must be specified in --gen_config or "
                + "'"
                + TTSHelper.TTS_SAVED_OBJECTS_FOLDER
                + "' must exist."
            )
