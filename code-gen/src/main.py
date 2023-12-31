#!/usr/bin/python
import argparse
import csv
import json
import subprocess

HEAD = """
// This file is generated. Do not edit! 
// Edit the cards.csv instead and regenerate

use array::ArrayTrait;
use option::OptionTrait;
use traits::TryInto;
fn get(card_id: u128) -> Option<{0}> {{
    let a: Array<Option<{0}>> = array![
"""
FOOT =  """
    ];
    // card indices should never exceed u32 size
    *a.at(card_id.try_into().unwrap())
}
"""

RMAP_HEAD = """
// This file is generated. Do not edit! 
// Edit the cards.csv instead and regenerate

use array::ArrayTrait;
use option::OptionTrait;
use traits::TryInto;
"""
RMAP_FN = """
fn {}() -> Array<u128> {{
    array![
"""
RMAP_FOOT =  """
    ]
}
"""

def writeCardsRegionMapping(regionMap):
    with open(args.outdir + "/" + "region_lookup" + ".cairo", "w") as f:
        f.write(RMAP_HEAD)

        for (region, card_ids) in regionMap.items():
            f.write(RMAP_FN.format(region))
            for cardId in card_ids:
                f.write("        {},\n".format(cardId))
            f.write(RMAP_FOOT)
            

def parse_type(val: str):
    try:
        return "({}, true)".format(abs(int(val))) if int(val) < 0 else "({}, false)".format(abs(int(val))), '(u32, bool)'
    except ValueError:
        if not val:
            return None, "unknown"
        elif val == "TRUE":
            return 'true', 'bool'
        elif val == "FALSE":
            return 'false', 'bool'
        else: 
            raise ValueError("cannot convert to u32 or bool")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--cardlist",
        type=str,
        required=True,
        help="Path to CSV formatted list of cards",
    )
    parser.add_argument(
        "--outdir",
        type=str,
        required=True,
        help="Directory to write out generated files",
    )
    parser.add_argument(
        "--json-outdir",
        type=str,
        required=False,
        help="Directory to write out generated files",
    )   
    parser.add_argument(
        "--skip",
        nargs='+', default=[],
        help="Columns to skip",
    ) 
    args = parser.parse_args()

    cardIdsPerRegion = { 'forest' : [], 'cave': [], 'meadow': [], 'volcano': [] }

    with open(args.cardlist) as csvfile:
        reader = csv.DictReader(csvfile)
        rows = list(reader)

        if args.json_outdir:
            for card in rows:
                params = json.dumps(card).replace('"', '\\"')
                cmd = f"./make_card_description.py \"{params}\""
                try:
                    text = subprocess.check_output(cmd, shell=True, text=True)
                    print(text)
                    card['description'] = text
                except subprocess.CalledProcessError as e:
                    print(f"Error running the command {cmd}: {e}")

            json.dump(rows, open(args.json_outdir + "/cards.json", "w"), indent=2)

        for row in rows:
            if row['card_type'] in cardIdsPerRegion.keys():
                cardIdsPerRegion[row['card_type']].append(int(row['card_id']))

        writeCardsRegionMapping(cardIdsPerRegion)

        with open(args.outdir + ".cairo", "w") as module_file:
            module_file.write(f"mod region_lookup;\n")

            for field in reader.fieldnames:
                if field in args.skip:
                    continue
                module_file.write(f"mod {field};\n")
                with open(args.outdir + "/" + field + ".cairo", "w") as f:
                    
                    # scan through and find the type
                    for row in rows:
                        _, typ = parse_type(row[field])
                        if typ != "unknown":
                            break
                    f.write(HEAD.format(typ))
                    
                    for row in rows:
                        if row[field]:
                            v, _ = parse_type(row[field])
                            f.write("        Option::Some({}),\n".format(v))
                        else:
                            f.write("        Option::None,\n")
                    f.write(FOOT)
                    f.close()
