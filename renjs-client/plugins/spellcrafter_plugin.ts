import cards from "../generated/cards.json";

import { SpellcrafterGame, newGame, forage, interact } from "./spellcrafter_game";

class SpellcrafterPlugin extends RenJS.Plugin {

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
    // 
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
                case "showItemsChoice":
                    console.log(this.spellcrafterGame.cards);
                    return Promise.resolve();
                case "interact":
                    return interact(this.spellcrafterGame, parseInt(args[0]));
                default:
                    throw new Error("invalid method: " + method);
            }
        }

        decodeCall(method, ...args).then(() => {
            this.syncState();
            this.game.resolveAction(); // must call this to return control to the story
        })
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

        const lastForagedItem: number | null = this.spellcrafterGame.cards.length > 0 ? this.spellcrafterGame.cards[this.spellcrafterGame.cards.length - 1] : null;
        this.game.managers.logic.vars["lastForagedItemName"] =  lastForagedItem ? cards[lastForagedItem].name : null
        this.game.managers.logic.vars["lastForagedItemDescription"] = lastForagedItem ? cards[lastForagedItem].flavour : null
    }
}

RenJSGame.addPlugin('SpellCrafter', SpellcrafterPlugin)
