class SpellcrafterPlugin extends RenJS.Plugin {

    /// Called when the plugin is called from the story using
    // call SpellCrafter: arg1 arg2 arg3 etc
	onCall() {
        console.log("hi from spellcrafter plugin");

        this.game.resolveAction(); // must call this to return control to the story
	}

    /// Called every Phaser update loop. No need to return anything from here
    onUpdateLoop(): void {

	}
}

RenJSGame.addPlugin('SpellCrafter', SpellcrafterPlugin)
