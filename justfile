set positional-arguments
set export

DOJO_VERSION := "0.3.15"
STARKNET_RPC_URL := "http://localhost:5050"

default:
  just --list

install_dojo:
	dojoup --version $DOJO_VERSION

cardgen:
	sh ./scripts/gen-cards.sh

codegen:
	sh ./scripts/gen-code.sh

build_contracts:
	cd contracts && sozo build

test:
	cd contracts && sozo test

migrate:
	cd contracts && sozo migrate

# fetch the cards from the google sheet and write to cards.csv in this repo
fetch_cards:
	wget "https://docs.google.com/spreadsheets/d/1sGTB4XvrHmZ_Dn9QZinwOZWRTMmCjCy_FNpdIodMlHE/gviz/tq?tqx=out:csv&sheet=cards" -O cards.csv

# Set the auth for the world contract so spellcrafter systems can interact with the required components
set_auth:
	#!/usr/bin/env bash
	set -euxo pipefail 

	WORLD_ADDRESS=$(cat ./contracts/target/dev/manifest.json | jq -r '.world.address')
	GAME_ADDRESS=$(cat ./contracts/target/dev/manifest.json | jq -r '.contracts[] | select(.name == "spellcrafter_system" ).address')

	COMPONENTS=("Valueingame" "Owner" "Familiar" "Occupied" )
	
	cd contracts

	for component in ${COMPONENTS[@]}; do
		sozo auth writer $component $GAME_ADDRESS --world $WORLD_ADDRESS --rpc-url $STARKNET_RPC_URL
	done

# start the dev server hosting the web client
start_client:
	cd client && bun install && bun run dev

# start a katana devnet
start_devnet:
	katana --disable-fee --seed=0

# Requires a devnet running on STARKNET_RPC_URL
start_indexer:
	#!/usr/bin/env bash
	set -euxo pipefail
	WORLD_ADDRESS=$(cat ./contracts/target/dev/manifest.json | jq -r '.world.address')
	torii --world ${WORLD_ADDRESS} --rpc $STARKNET_RPC_URL
