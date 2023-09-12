#!/usr/bin/python
import argparse
import csv

HEAD = """
// This file is generated. Do not edit! 
// Edit the cards.csv instead and regenerate

use array::ArrayTrait;
use option::OptionTrait;
fn get(card_id: u32) -> Option<felt252> {
    let a = array![
"""
FOOT =  """
    ];
    a.get(card_id)
}
"""

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
        "--skip",
        nargs='+', default=[],
        help="Columns to skip",
    ) 
    args = parser.parse_args()

    with open(args.cardlist) as csvfile:
        reader = csv.DictReader(csvfile)
        rows = list(reader)

        with open(args.outdir + ".cairo", "w") as module_file:
            for field in reader.fieldnames:
                if field in args.skip:
                    continue
                module_file.write(f"mod {field};\n")
                with open(args.outdir + "/" + field + ".cairo", "w") as f:
                    f.write(HEAD)
                    for row in rows:
                        if row[field]:
                            try:
                                f.write(f"        Option::Some({int(row[field])}),\n")
                            except ValueError:
                                f.write(f"        Option::Some('{row[field]}'),\n")
                        else:
                            f.write("        Option::None,\n")
                    f.write(FOOT)
                    f.close()

