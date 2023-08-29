#!/usr/bin/python
import sys
from dataclasses import dataclass
from typing import Optional

from PIL import Image, ImageDraw, ImageFont

from layer.card_layer import CardLayer
from layer.image_card_layers import BasicImageLayer
from param.config_enums import HorizontalAlignment, VerticalAlignment
from provider.input_provider import InputProvider
from util.placement import Placement, move_placement, to_box

_DEFAULT_FONT_WINDOWS = "\\Windows\\Fonts\\constan.ttf"
_DEFAULT_FONT_MACOS = "/System/Library/Fonts/Supplemental/Georgia.ttf"
_DEFAULT_FONT_LINUX = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
_STARTING_FONT_SIZE = 32


class EmbeddedImageTextCardLayer(CardLayer):
    @dataclass
    class EmbeddedImage:
        place: Placement
        image_id: str

    def __init__(
        self,
        text: str,
        placement: Placement,
        input_provider: InputProvider,
        embedding_map: dict[str, str] = {},
        max_font_size: Optional[int] = None,
        font_file: Optional[str] = None,
        spacing_ratio: Optional[float] = None,
        v_alignment: Optional[VerticalAlignment] = None,
        h_alignment: Optional[HorizontalAlignment] = None,
        embed_v_offset_ratio: Optional[float] = None,
        embed_size_ratio: Optional[float] = None,
        color: Optional[str] = None,
    ):
        self._text = text
        self._placement = placement
        self._input_provider = input_provider
        self._embedding_map = embedding_map

        self._starting_font_size = max_font_size or _STARTING_FONT_SIZE
        self._font_file = font_file or _get_default_font_file()
        self._spacing_ratio = spacing_ratio or 0
        self._v_alignment = v_alignment or VerticalAlignment.TOP
        self._h_alignment = h_alignment or HorizontalAlignment.LEFT

        if (
            self._h_alignment != HorizontalAlignment.LEFT
            and len(self._embedding_map.keys()) > 0
        ):
            print(
                "Warning: embedded images not support with text aligment "
                + self._h_alignment
            )
            self._embedding_map = {}

        self._embed_v_offset_ratio = embed_v_offset_ratio or 0
        self._embed_size_ratio = embed_size_ratio or 1
        self._color = color or "#000000"

    def render(self, onto: Image.Image):
        outer_box = CardLayer._move_box((0, 0), to_box(self._placement))
        font_size = self._starting_font_size
        draw = ImageDraw.Draw(onto, "RGBA")

        while True:
            font = ImageFont.truetype(self._font_file, font_size)
            spacing = int(self._spacing_ratio * font.getbbox(" ")[3])

            (text_lines, embeds) = self._split_lines_and_place_embeds(
                draw, font, spacing
            )
            multiline_text = "\n".join(text_lines)

            text_box = draw.multiline_textbbox(
                (0, 0),
                multiline_text,
                font,
                spacing=spacing,
            )

            if CardLayer._within_box(outer_box, text_box, 5):
                break

            font_size = font_size - 1
            if font_size < 8:
                print("Warning: failed to fit text in a box: " + self._text)
                break

        v_offset = _get_v_offset(self._v_alignment, self._placement, text_box)
        h_offset = _get_h_offset(self._h_alignment, self._placement, text_box)
        draw.multiline_text(
            (self._placement.x + h_offset, self._placement.y + v_offset),
            multiline_text,
            font=font,
            fill=self._color,
            spacing=spacing,
            align="" + self._h_alignment,
        )

        embed_v_offset = int(self._embed_v_offset_ratio * font.getbbox(" ")[3])
        self._render_embeds(embeds, (h_offset, v_offset + embed_v_offset), onto)

    def _split_lines_and_place_embeds(
        self,
        draw: ImageDraw.ImageDraw,
        font: ImageFont.FreeTypeFont,
        spacing: int,
    ) -> tuple[list[str], list[EmbeddedImage]]:
        lines = []
        embeds = []
        line_height = draw.textsize(" ", font)[1]
        line_and_spacing_height = line_height + spacing

        (padded_text, embeddings) = self._pad_embeddings(draw, font)

        embeddings.sort(key=(lambda ei: ei[0]))
        i_embeddings = 0
        i_text = 0
        while i_text < len(padded_text):
            length = _find_next_fit_length(padded_text, i_text, font, self._placement.w)

            if length == 0:
                print("Warning: unable to fit text a row")
                return (self._text, [])

            while (
                i_embeddings < len(embeddings)
                and embeddings[i_embeddings][0] < i_text + length
            ):
                embed = embeddings[i_embeddings]
                embed_file = embed[1]
                embed_size = embed[2]

                # x offset for the preceding text and the spacing due to embedding size ratio
                x = (
                    self._placement.x
                    + draw.textsize(padded_text[i_text : embed[0]], font)[0]
                    + (embed_size[1] - embed_size[1] * self._embed_size_ratio) / 2
                )

                # y offset for the preceding lines and the spacing due to embedding size ratio and v offset
                y = (
                    self._placement.y
                    + (len(lines) * line_and_spacing_height)
                    + (line_height * self._embed_v_offset_ratio)
                    + (embed_size[1] - embed_size[1] * self._embed_size_ratio) / 2
                )

                w = embed_size[0] * self._embed_size_ratio
                h = embed_size[1] * self._embed_size_ratio
                embeds.append(
                    self.EmbeddedImage(
                        Placement(int(x), int(y), int(w), int(h)),
                        embed_file,
                    ),
                )

                i_embeddings = i_embeddings + 1

            lines.append(padded_text[i_text : i_text + length])
            i_text = i_text + length

        return (lines, embeds)

    # returns (padded_string, embeddings)
    # embeddings: list of (index in padded text, embedding id, image size)
    def _pad_embeddings(
        self, draw: ImageDraw.ImageDraw, font: ImageFont.ImageFont
    ) -> tuple[str, list[tuple[int, str, tuple[int, int]]]]:
        index = 0
        total_padding = 0
        last_index = 0
        embeddings = list()

        new_text = ""
        while index < len(self._text):
            next = self._next_word_index(self._text, index)
            word = self._text[index:next]

            embedding = self._embedding_map.get(word.strip())
            if embedding is not None:
                (padding, embedding_size) = self._get_padding_str(embedding, draw, font)
                embeddings.append((index + total_padding, embedding, embedding_size))

                replacement_text = word.replace(word.strip(), padding)
                new_text = new_text + self._text[last_index:index] + replacement_text
                last_index = next
                total_padding = total_padding + len(replacement_text) - len(word)

            index = next

        if last_index != index:
            new_text = new_text + self._text[last_index:index]

        return (new_text, embeddings)

    def _next_word_index(self, text: str, start: int) -> int:
        while start < len(text) and not text[start].isspace():
            start = start + 1
        while start < len(text) and text[start].isspace():
            start = start + 1
        return start

    def _render_embeds(
        self, embeds: list[EmbeddedImage], offset: tuple[int, int], onto: Image.Image
    ):
        for embed in embeds:
            BasicImageLayer(
                self._input_provider,
                embed.image_id,
                move_placement(offset[0], offset[1], embed.place),
            ).render(onto)

    # gets the padding string and the size of the embed the padding is for
    def _get_padding_str(
        self, embed_file: str, draw: ImageDraw.ImageDraw, font: ImageFont.ImageFont
    ) -> tuple[str, tuple[int, int]]:
        with self._input_provider.get_image(embed_file) as embed_image:
            # the padding should have similar w/h ratio as the embedding
            image_w_h_ratio = embed_image.width / embed_image.height
            height_px = draw.textsize(" ", font)[1]
            target_width = image_w_h_ratio * height_px
            padding = " "
            while draw.textsize(padding, font)[0] < target_width:
                padding = padding + " "

            w_ratio = embed_image.width / draw.textsize(padding, font)[0]
            return (
                padding,
                (int(embed_image.width / w_ratio), int(embed_image.height / w_ratio)),
            )


# returns length of string starting from start that fits in
# the width of the box
def _find_next_fit_length(
    text: str, start: int, font: ImageFont.FreeTypeFont, width_px: int
) -> int:
    newline = text[start:].find("\n")
    end = start + newline if newline != -1 else len(text) - 1

    # no newlines at this point
    while end > start and font.getlength(text[start : end + 1]) > width_px:
        # scan from right for the next word
        # first skip any whitespaces
        char_seen = False
        while end > start:
            if text[end].isspace():
                if char_seen:
                    break
            else:
                char_seen = True

            end = end - 1

    return end - start + 1


# determines the vertical offset for a box the size of bbox align
def _get_v_offset(
    v_alignment: Optional[VerticalAlignment],
    text_placement: Placement,
    bbox: tuple[int, int, int, int],  # left, top, right, bottom
) -> int:
    if v_alignment == VerticalAlignment.MIDDLE:
        v_offset = int((text_placement.h - (bbox[3] - bbox[1])) / 2)
    elif v_alignment == VerticalAlignment.BOTTOM:
        v_offset = int(text_placement.h - (bbox[3] - bbox[1]))
    else:
        v_offset = 0
    return v_offset


# determines the horizontal offset for a box the size of bbox align
def _get_h_offset(
    h_alignment: Optional[HorizontalAlignment],
    text_placement: Placement,
    bbox: tuple[int, int, int, int],
) -> int:
    if h_alignment == HorizontalAlignment.CENTER:
        h_offset = int((text_placement.w - (bbox[2] - bbox[0])) / 2)
    elif h_alignment == HorizontalAlignment.RIGHT:
        h_offset = int(text_placement.w - (bbox[2] - bbox[0]))
    else:
        h_offset = 0
    return h_offset


def _get_default_font_file() -> str:
    if sys.platform.startswith("win32"):
        return _DEFAULT_FONT_WINDOWS
    elif sys.platform.startswith("darwin"):
        return _DEFAULT_FONT_MACOS
    elif sys.platform.startswith("linux"):
        return _DEFAULT_FONT_LINUX
    else:
        raise Exception("No default font known for OS.")
