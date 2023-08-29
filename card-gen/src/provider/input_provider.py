#!/usr/bin/python
import os
from abc import ABC, abstractmethod

import PIL.Image
from csv import DictReader


from google.google_drive_client import GoogleDriveClient
from param.config_enums import InputProviderType
from util.helpers import Helpers as h


class InputProvider(ABC):
    @classmethod
    @property
    @abstractmethod
    def TYPE(cls) -> InputProviderType:
        pass

    @abstractmethod
    def get_decklist(self, name: str) -> list[dict[str, str]]:
        pass

    @abstractmethod
    def get_image(self, name: str) -> PIL.Image.Image:
        pass


class InputProviderFactory(ABC):
    _DEFAULT = InputProviderType.LOCAL

    @staticmethod
    def build(config: dict) -> InputProvider:
        t = h.dont_require(config, "input/type") or InputProviderFactory._DEFAULT

        if t == InputProviderType.LOCAL:
            return LocalInputProvider(config)
        elif t == InputProviderType.GOOGLE:
            return GoogleInputProvider(config)
        else:
            raise Exception("Unsupported input provider type '" + t + "'")


class LocalInputProvider(InputProvider):
    @classmethod
    @property
    def TYPE(cls) -> InputProviderType:
        return InputProviderType.LOCAL

    def __init__(self, config: dict):
        self._folder = h.require(config, "input/folder")

    def get_decklist(self, path: str) -> list[dict[str, str]]:
        with open(path, "r") as f:
            return list(DictReader(f.readlines(), delimiter=","))

    def get_image(self, name: str) -> PIL.Image.Image:
        return PIL.Image.open(os.path.join(self._folder, name))


class GoogleInputProvider(InputProvider):
    @classmethod
    @property
    def TYPE(cls) -> InputProviderType:
        return InputProviderType.GOOGLE

    def __init__(self, config: dict):
        self._client = GoogleDriveClient(h.require(config, "google_secrets_path"))
        self._folder = h.require(config, "input/folder")
        self._temp_folder = h.require(config, "input/temp_folder")
        if not os.path.exists(self._temp_folder):
            os.makedirs(self._temp_folder)

    def get_decklist(self, name: str) -> list[dict[str, str]]:
        return list(self._client.download_csv(name, self._folder))

    def get_image(self, name: str) -> PIL.Image.Image:
        temp_file = os.path.join(self._temp_folder, name)
        self._client.download_file(name, temp_file, self._folder)
        return PIL.Image.open(temp_file)
