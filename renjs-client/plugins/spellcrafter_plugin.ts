import cards from "../generated/cards.json";

import { SpellcrafterGame, newGame, forage, interact, approachSpell } from "./spellcrafter_game";
export class SpellcrafterPlugin extends RenJS.Plugin {
// class SpellcrafterPlugin extends Plugin {

    spellcrafterGame: SpellcrafterGame;
    
    // called when new game is started, just before interpreter is called
    onStart(): void {
        this.spellcrafterGame = newGame();
        this.syncState();
	}

    /// Called when the plugin is called from the story the `call spellcrafter` command
    // examples:
    //  call SpellCrafter: forage forest
    //  call SpellCrafter: interact 3
    // call spellCrafter : showItemsChoice
	onCall({body}): void {
        console.log("spellcrafter called with: ", body);
        const [method, ...args] = body.split(" ");

        const decodeCall = (method: string, ...args: any[]): Promise<void> => {
            switch(method) {
                case "forage":
                    switch(args[0]) {
                        case "forest":
                            return forage(this.spellcrafterGame, 0);
                        case "meadow":
                            return forage(this.spellcrafterGame, 1);
                        case "volcano":
                            return forage(this.spellcrafterGame, 2);
                        case "cave":
                            return forage(this.spellcrafterGame, 3);
                        default:
                            throw new Error("invalid region to forage: " + args[0]);
                    }
                case "checkApproachSpell":
                    return this.checkApproachSpell();
                case "selectAndAddIngredient":
                    return this.selectAndAddIngredient();
                default:
                    throw new Error("invalid method: " + method);
            }
        }

        decodeCall(method, ...args).then(() => {
            this.syncState();
            this.game.resolveAction(); // must call this to return control to the story
        })
	}

    /// Display the currently owned items and allow the player to select one
    /// After this resolves the `chosenItem` variable will hold the index of the chosen item
    /// This promise will also resolve with the chosen value
    async selectAndAddIngredient(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.game.gui.hud.hide();
            // add a button for each card
            let btns = []
            this.spellcrafterGame.cards.forEach((cardId, index) => {
                const btn = this.game.add.button(50+index*130, 200, "cardback", async () => {
                    btns.forEach((btn) => btn.destroy());

                    let pre_stats = {...this.spellcrafterGame.stats};
                    await interact(this.spellcrafterGame, cardId);
                    this.game.managers.logic.vars["lastAddedItemName"] =  cards[cardId].name;
                    this.game.managers.logic.vars["chaosDelta"] = this.spellcrafterGame.stats.chaos - pre_stats.chaos;
                    this.game.managers.logic.vars["powerDelta"] = this.spellcrafterGame.stats.power - pre_stats.power;
                    this.game.managers.logic.vars["lightdarkDelta"] = this.spellcrafterGame.stats.lightDark - pre_stats.lightDark;
                    this.game.managers.logic.vars["hotcoldDelta"] = this.spellcrafterGame.stats.hotCold - pre_stats.hotCold;

                    resolve();
                }, this, 0);
                btns.push(btn);
            });
        });
    }

    async checkApproachSpell(): Promise<void> {
        let pre_barriers = this.spellcrafterGame.stats.barriers;
        await approachSpell(this.spellcrafterGame);
        this.game.managers.logic.vars["barriersDelta"] = this.spellcrafterGame.stats.barriers - pre_barriers;
    }

    /// copies variables from the game state object into the renjs context
    /// so they can be displayed in-game and used to alter the story flow
    syncState(): void {
        const stats = this.spellcrafterGame.stats;

        this.game.managers.logic.vars["chaos"] = stats.chaos;
        this.game.managers.logic.vars["power"] = stats.power;
        this.game.managers.logic.vars["lightdark"] = stats.lightDark;
        this.game.managers.logic.vars["hotcold"] = stats.hotCold;
        this.game.managers.logic.vars["barriers"] = stats.barriers;
        this.game.managers.logic.vars["dead"] = stats.barriers <= 0;
        this.game.managers.logic.vars["itemCount"] = this.spellcrafterGame.cards.length;

        const lastForagedItem: number | null = this.spellcrafterGame.cards.length > 0 ? this.spellcrafterGame.cards[this.spellcrafterGame.cards.length - 1] : null;
        this.game.managers.logic.vars["lastForagedItemName"] =  lastForagedItem ? cards[lastForagedItem].name : null
        this.game.managers.logic.vars["lastForagedItemDescription"] = lastForagedItem ? cards[lastForagedItem].description : null
        this.game.managers.logic.vars["lastForagedItemFlavour"] = lastForagedItem ? cards[lastForagedItem].flavour : null
    }
}
