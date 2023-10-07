import cards from "../generated/cards.json";

class SpellcrafterPlugin extends RenJS.Plugin {

    items: Array<number>; // array of card indices of held items
    vars: { [key: string]: any; }; // game variables

    // called when new game is started, just before interpreter is called
    onStart(): void {
        // set initial game variables
        this.vars = this.game.managers.logic.vars;

        this.vars["chaos"] = 0;
        this.vars["power"] = 0;
        this.vars["lightdark"] = 0;
        this.vars["hotcold"] = 0;
        this.vars["barriers"] = 3;
        this.vars["dead"] = false;
        this.vars["lastForagedItem"] = null;

        this.items = []
	}

    /// Called when the plugin is called from the story the `call spellcrafter` command
    // examples:
    //  call SpellCrafter: forage forest
    //  call SpellCrafter: interact 3
    // 
	onCall({body}): void {
        console.log("spellcrafter called with: ", body);
        const [method, ...args] = body.split(" ");
        switch(method) {
            case "forage":
                this.forage(args[0]);
                break;
            case "interact":
                this.interact(args[0]);
                break;
        }

        this.game.resolveAction(); // must call this to return control to the story
	}

    // /// Called every Phaser update loop. No need to return anything from here
    // onUpdateLoop(): void {

	// }

    forage(region): void {
        switch(region) {
            case "forest":
            case "meadow":
            case "volcano":
            case "cave":
                let item = randomCard();
                this.items.push(parseInt(item.card_id));
                this.vars["lastForagedItem"] = item.name;
                break;
            default:
                console.error("invalid region to forage: ", region);
        }
        this.vars["chaos"] += 3;
    }

    interact(region): void {
        this.vars["power"] += 1;
    }
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCard() {
    return cards[randomInteger(0, cards.length - 1)]
}

RenJSGame.addPlugin('SpellCrafter', SpellcrafterPlugin)
