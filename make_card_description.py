#!/usr/bin/env python

import sys
import json

# Anything printed in this script becomes part of the card description

card = json.loads(sys.argv[1])

if card["power_delta"]:
    print(f"+{card['power_delta']} POWER")
if card["chaos_delta"]:
    print(f"+{card['power_delta']} CHAOS")

# elemental deltas    
if card["hotcold_delta"]:
    if int(card["hotcold_delta"]) > 0:
        print(f"+{card['hotcold_delta']} HOT")
    else:
        print(f"+{card['hotcold_delta']} COLD")

if card["lightdark_delta"]:
    if int(card["lightdark_delta"]) > 0:
        print(f"+{card['lightdark_delta']} LIGHT")
    else:
        print(f"+{card['lightdark_delta']} DARK")

# elemental swaps
if card["swaps_lightdark"]:
    print("Swap light and dark stats")
if card["swaps_hotcold"]:
    print("Swap hot and cold stats")
