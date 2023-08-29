#!/usr/bin/python
import json
import os
from abc import ABC, abstractmethod

import PIL.Image

from param.config_enums import OutputProviderType
from util.helpers import Helpers as h


class OutputProvider(ABC):
    @classmethod
    @property
    @abstractmethod
    def TYPE(cls) -> OutputProviderType:
        pass

    @abstractmethod
    def save_image(self, img: PIL.Image.Image, name: str) -> str:
        pass

    @abstractmethod
    def save_json(self, j: dict, name: str) -> str:
        pass


class OutputProviderFactory(ABC):
    _DEFAULT = OutputProviderType.LOCAL

    @staticmethod
    def build(config: dict) -> OutputProvider:
        t = h.dont_require(config, "output/type") or OutputProviderFactory._DEFAULT

        if t == OutputProviderType.LOCAL:
            return LocalOutputProvider(config)
        else:
            raise Exception("Unsupported output provider '" + t + "'")


class LocalOutputProvider(OutputProvider):
    @classmethod
    @property
    def TYPE(cls) -> OutputProviderType:
        return OutputProviderType.LOCAL

    def __init__(self, config: dict):
        self._folder = h.require(config, "output/folder")
        if not os.path.exists(self._folder):
            os.makedirs(self._folder)

    def save_image(self, img: PIL.Image.Image, name: str) -> str:
        output_file = os.path.join(self._folder, name)
        img.save(
            output_file,
            format=name.split(".")[-1] if "." in name else "png",
        )
        return output_file

    def save_json(self, j: dict, name: str) -> str:
        out_file = os.path.join(self._folder, name)
        with open(out_file, "w") as f:
            json.dump(j, f, indent=4)
        return out_file
