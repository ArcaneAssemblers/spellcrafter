#!/usr/bin/python
from abc import ABC


class Helpers(ABC):
    @staticmethod
    def require(config: dict, key: str or list[str]):
        if not isinstance(key, list):
            key = key.split("/")
        v = config
        for k in key:
            if not isinstance(v, dict):
                raise Exception("Invalid config path " + "/".join(key))
            v = v.get(k)
            if v == None:
                raise Exception("Could not find path " + "/".join(key))
        return v

    @staticmethod
    def dont_require(config: dict, key: str or list[str]):
        if not isinstance(key, list):
            key = key.split("/")
        v = config
        for k in key:
            if not isinstance(v, dict):
                raise Exception("Invalid config path " + "/".join(key))
            v = v.get(k)
            if v is None:
                break
        return v
