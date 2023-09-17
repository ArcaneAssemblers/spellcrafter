set positional-arguments

cards:
	sh ./scripts/gen-cards.sh

code:
	sh ./scripts/gen-code.sh

contracts:
	cd contracts && sozo build

test:
	cd contracts && sozo test

migrate:
	cd contracts && sozo migrate

fetch_cards:
	wget "https://docs.google.com/spreadsheets/d/1sGTB4XvrHmZ_Dn9QZinwOZWRTMmCjCy_FNpdIodMlHE/gviz/tq?tqx=out:csv&sheet=cards" -O cards.csv

# Game operaions

new_game:
	sozo execute NewGame --manifest-path contracts/Scarb.toml

@forage game_id region:
	sozo execute Forage -c $1,$2 --manifest-path contracts/Scarb.toml
