#!/usr/bin/env python

import sys
import json

# Anything printed in this script becomes part of the card description

card = json.loads(sys.argv[1])

prefix = "";

if "familiar" in card['card_type']:
    print("Sacrifice Action:")
    prefix = "  "

# Conditionals
if card["requires_hot_gt"]:
    print(f"If HOT > {card['requires_hot_gt']}:")
    prefix = "  "
if card["requires_light_gt"]:
    print(f"If LIGHT > {card['requires_light_gt']}:")
    prefix = "  "
if card["requires_cold_gt"]:
    print(f"If COLD > {card['requires_cold_gt']}:")
    prefix = "  "
if card["requires_dark_gt"]:
    print(f"If DARK > {card['requires_dark_gt']}:")
    prefix = "  "

# Power, Chaos, barriers deltas
if card["power_delta"]:
    print(prefix+"{0:+} POWER".format(int(card["power_delta"])))
if card["chaos_delta"]:
    print(prefix+"{0:+} CHAOS".format(int(card["chaos_delta"])))

if card["barriers_delta"]:
    if int(card["barriers_delta"]) > 0:
        print(prefix+f"Rebuild {card['barriers_delta']} barrier up to a maximum of 3")
    else:
        print(prefix+f"Destroy {card['barriers_delta']} barrier")
# elemental deltas    
if card["hotcold_delta"]:
    if int(card["hotcold_delta"]) > 0:
        print(prefix+f"+{card['hotcold_delta']} HOT")
    else:
        print(prefix+f"+{abs(int(card['hotcold_delta']))} COLD")

if card["lightdark_delta"]:
    if int(card["lightdark_delta"]) > 0:
        print(prefix+f"+{card['lightdark_delta']} LIGHT")
    else:
        print(prefix+f"+{abs(int(card['lightdark_delta']))} DARK")

# elemental swaps
if card["swaps_lightdark"]:
    print(prefix+"Swap LIGHT and DARK stats")
if card["swaps_hotcold"]:
    print(prefix+"Swap HOT and COLD stats")

# fallbacks (e.g. else arms for conditionals)

if card["power_delta_fallback"] or card["chaos_delta_fallback"] or card["hotcold_delta_fallback"] or card["lightdark_delta_fallback"]:
    print("Else:")
    prefix = "  "

if card["power_delta_fallback"]:
    print(prefix+"{0:+} POWER".format(int(card["power_delta_fallback"])))
if card["chaos_delta_fallback"]:
    print(prefix+"{0:+} CHAOS".format(int(card["chaos_delta_fallback"])))

# elemental delta_fallbacks    
if card["hotcold_delta_fallback"]:
    if int(card["hotcold_delta_fallback"]) > 0:
        print(prefix+f"+{card['hotcold_delta_fallback']} HOT")
    else:
        print(prefix+f"+{abs(int(card['hotcold_delta_fallback']))} COLD")

if card["lightdark_delta_fallback"]:
    if int(card["lightdark_delta_fallback"]) > 0:
        print(prefix+f"+{card['lightdark_delta_fallback']} LIGHT")
    else:
        print(prefix+f"+{abs(int(card['lightdark_delta_fallback']))} DARK")
