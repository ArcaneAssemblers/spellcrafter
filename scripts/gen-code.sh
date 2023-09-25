#!/usr/bin/env bash
set -e

python -m venv env
source env/bin/activate
pip install -r ./card-gen/requirements.txt

python ./code-gen/src/main.py --cardlist ./cards.csv --outdir ./contracts/src/cards/properties --json-outdir ./client/src/generated/ --skip name flavour count card_id card_type

deactivate
