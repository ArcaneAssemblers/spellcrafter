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


