#!/usr/bin/python
import json
import os
from abc import ABC
from math import ceil


class TTSHelper(ABC):
    TTS_SAVED_OBJECTS_FOLDER = (
        os.path.expanduser("~")
        + "/Documents/My Games/Tabletop Simulator/Saves/Saved Objects"
    )
    _GOOGLE_DOWNLOAD_URL_FORMAT = "https://drive.google.com/uc?export=download&id={}"
    _TEMPLATE_FILE = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), "tts_deck_object_template.json"
    )
    _DECK_KEY = 41  # TODO understand what the keys in "CustomDeck are"

    # returns the dict representation of the TTS deck saved object file
    @staticmethod
    def build_deck(deck_size: int, max_width: int, front_id: str, back_id: str) -> dict:
        with open(TTSHelper._TEMPLATE_FILE) as template:
            deck_object = json.load(template)

        deck_object["ObjectStates"][0]["DeckIDs"] = [
            TTSHelper._DECK_KEY * 100 + i for i in range(deck_size)
        ]

        num_wide = min(max_width, deck_size)
        deck_object["ObjectStates"][0]["CustomDeck"] = {
            str(TTSHelper._DECK_KEY): {
                "FaceURL": TTSHelper._GOOGLE_DOWNLOAD_URL_FORMAT.format(front_id),
                "BackURL": TTSHelper._GOOGLE_DOWNLOAD_URL_FORMAT.format(back_id),
                "NumWidth": num_wide,
                "NumHeight": ceil(deck_size / num_wide),
                "BackIsHidden": True,
                "UniqueBack": False,
                "Type": 0,
            }
        }

        return deck_object

    @staticmethod
    def save_object(
        tts_object: dict, name: str, tts_saved_objects_folder: str | None
    ) -> str | None:
        folder = tts_saved_objects_folder or TTSHelper.TTS_SAVED_OBJECTS_FOLDER
        if not os.path.exists(folder):
            return None
        out_file = os.path.join(folder, name)
        with open(out_file, "w") as f:
            json.dump(tts_object, f, indent=4)
        return out_file
