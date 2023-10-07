class SpellcrafterPlugin extends RenJS.Plugin {

    items: [number]; // array of card indices of held items
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

    /// Called every Phaser update loop. No need to return anything from here
    onUpdateLoop(): void {

	}

    forage(region): void {
        this.items.push(1);
    }

    interact(region): void {
        this.vars["power"] += 1;
    }
}

RenJSGame.addPlugin('SpellCrafter', SpellcrafterPlugin)
