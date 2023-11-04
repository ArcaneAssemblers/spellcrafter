import cards from "../generated/cards.json";
import { Plugin } from "renjs";

import { SpellcrafterGame, newGame, forage, interact, approachSpell, summonFamiliar, sendFamiliar, claimFamiliarItem, sacrificeFamiliar } from "./spellcrafter_game";
export class SpellcrafterPlugin extends RenJS.Plugin {
// class SpellcrafterPlugin extends Plugin {

    spellcrafterGame: SpellcrafterGame;
    cardDisplayGroup;
    setCard;
    barrierImages: any = [];
    
    // called when new game is started, just before interpreter is called
    onStart(): void {
        this.spellcrafterGame = newGame();

        const cardBack = this.game.add.image(195, 95, "cardback");
        const cardName = this.game.add.text(300, 150, "", { font: "55px fontsaudimat-mono", fill: "#FFFFFF", boundsAlignV: "top", boundsAlignH: "center" })
        const cardText = this.game.add.text(300, 270, "", { font: "40px fontsaudimat-mono", fill: "#FFFFFF", boundsAlignV: "middle" });

        this.cardDisplayGroup = this.game.add.group()
        this.cardDisplayGroup.add(cardBack);
        this.cardDisplayGroup.add(cardName);
        this.cardDisplayGroup.add(cardText);
        this.cardDisplayGroup.visible = false;

        this.setCard = (cardId: number) => {
            cardName.setText(cards[cardId].name);
            cardText.setText(cards[cardId].description);
        }

        this.barrierImages.push(this.game.add.image(700, 1520, "barrier"));
        this.barrierImages.push(this.game.add.image(800, 1520, "barrier"));
        this.barrierImages.push(this.game.add.image(900, 1520, "barrier"));
        this.barrierImages.forEach(img => { img.visible = false});

        this.syncState()
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
                case "printDebug":
                    console.log(this.spellcrafterGame);
                    return Promise.resolve();
                case "forage":
                    return this.forage(args[0]);
                case "checkApproachSpell":
                    return this.checkApproachSpell();
                case "selectAndAddIngredient":
                    return this.selectAndAddIngredient();
                case "summonFamiliar":
                    return this.summonFamiliar(args[0]);
                case "sendFamiliar":
                    return this.sendFamiliar();
                case "sacrificeFamiliar":
                    return this.sacrificeFamiliar();
                case "claimFamiliarItem":
                    return this.claimFamiliarItem();
                case "showCard":
                    return this.showCard();
                case "hideCard":
                    return this.hideCard();
                case "showBarriers":
                    this.barrierImages.forEach(img => { img.visible = true });
                    return Promise.resolve();
                case "hideBarriers":
                    this.barrierImages.forEach(img => { img.visible = false });
                    return Promise.resolve(); 
                default:
                    throw new Error("invalid method: " + method);
            }
        }

        decodeCall(method, ...args).then(() => {
            this.syncState();
            this.game.resolveAction(); // must call this to return control to the story
        }).catch((err) => {
            console.error(err.message);
            // hang forever
        });
	}

    /// Display the currently owned items and allow the player to select one
    /// After this resolves the `chosenItem` variable will hold the index of the chosen item
    /// This promise will also resolve with the chosen value
    async selectAndAddIngredient(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let selectedCardIndex = 0;

            const updateCardDisplay = () => {
                cardName.setText(cards[this.spellcrafterGame.cards[selectedCardIndex]].name);
                cardText.setText(cards[this.spellcrafterGame.cards[selectedCardIndex]].description);
            }

            const returnToStory = () => {
                cardBack.destroy();
                cardName.destroy();
                cardText.destroy();
                cancelButton.destroy();
                leftButton.destroy();
                rightButton.destroy();
                addToSpellButton.destroy();
                buttonText.destroy();

                resolve();
            }

            const cardBack = this.game.add.image(195, 95, "cardback");
            const cardName = this.game.add.text(300, 150, "", { font: "55px fontsaudimat-mono", fill: "#FFFFFF", boundsAlignV: "top", boundsAlignH: "center" })
            const cardText = this.game.add.text(300, 270, "", { font: "40px fontsaudimat-mono", fill: "#FFFFFF", boundsAlignV: "middle" });

            updateCardDisplay();

            const cancelButton = this.game.add.button(875, 90, "cancel-button", () => {
                this.game.managers.logic.vars["lastAddedItemName"] = "nothing";
                this.game.managers.logic.vars["chaosDelta"] = 0;
                this.game.managers.logic.vars["powerDelta"] = 0;
                returnToStory();
            }, this, 0);

            const leftButton = this.game.add.button(43, 845, "back-button", () => {
                selectedCardIndex = (selectedCardIndex - 1 + this.spellcrafterGame.cards.length) % this.spellcrafterGame.cards.length;
                updateCardDisplay()
            }, this, 0);
            const rightButton = this.game.add.button(875+150, 845+150, "back-button", () => {
                selectedCardIndex = (selectedCardIndex + 1) % this.spellcrafterGame.cards.length;
                updateCardDisplay()
            }, this, 0);
            rightButton.rotation = Math.PI;

            const addToSpellButton = this.game.add.button(40, 1025, "button", async () => {
                let pre_stats = {...this.spellcrafterGame.stats};
                this.game.managers.logic.vars["lastAddedItemName"] =  cards[this.spellcrafterGame.cards[selectedCardIndex]].name;
                await interact(this.spellcrafterGame, this.spellcrafterGame.cards[selectedCardIndex]);
                this.game.managers.logic.vars["chaosDelta"] = this.spellcrafterGame.stats.chaos - pre_stats.chaos;
                this.game.managers.logic.vars["powerDelta"] = this.spellcrafterGame.stats.power - pre_stats.power;
                this.game.managers.logic.vars["lightdarkDelta"] = this.spellcrafterGame.stats.lightDark - pre_stats.lightDark;
                this.game.managers.logic.vars["hotcoldDelta"] = this.spellcrafterGame.stats.hotCold - pre_stats.hotCold;

                returnToStory();
            }, this, 0);
            const buttonText = this.game.add.text(360, 1050, "Add To Spell", { font: "45px fontsaudimat-mono", fill: "#FFFFFF", boundsAlignV: "middle", boundsAlignH: "center" });

        });
    }

    async checkApproachSpell(): Promise<void> {
        let pre_barriers = this.spellcrafterGame.stats.barriers;
        await approachSpell(this.spellcrafterGame);
        this.game.managers.logic.vars["barriersDelta"] = this.spellcrafterGame.stats.barriers - pre_barriers;
    }

    async forage(region: string): Promise<void> {
        let pre_chaos = this.spellcrafterGame.stats.chaos;
        await forage(this.spellcrafterGame, region);
        this.game.managers.logic.vars["chaosDelta"] = this.spellcrafterGame.stats.chaos - pre_chaos;
    }

    async summonFamiliar(region: string): Promise<void> {
        let pre_chaos = this.spellcrafterGame.stats.chaos;
        await summonFamiliar(this.spellcrafterGame, region);
        this.game.managers.logic.vars["chaosDelta"] = this.spellcrafterGame.stats.chaos - pre_chaos;
    }

    async sendFamiliar(): Promise<void> {
        await sendFamiliar(this.spellcrafterGame);
    }

    async sacrificeFamiliar(): Promise<void> {
        await sacrificeFamiliar(this.spellcrafterGame);
    }

    async claimFamiliarItem(): Promise<void> {
        try {
            await claimFamiliarItem(this.spellcrafterGame);
            this.game.managers.logic.vars["familiarReturnedItem"] = true;
        } catch (err) { // just print errors here since we know this can fail
            console.log("familiar item check failed: ", err.message);
        }
    }

    async showCard(): Promise<void> {
        this.setCard(this.game.managers.logic.vars["lastForagedItem"]);
        this.cardDisplayGroup.visible = true;
    }

    async hideCard(): Promise<void> {
        this.cardDisplayGroup.visible = false;
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
        this.game.managers.logic.vars["lastForagedItem"] =  lastForagedItem ? cards[lastForagedItem].card_id : null
        this.game.managers.logic.vars["lastForagedItemName"] =  lastForagedItem ? cards[lastForagedItem].name : null
        this.game.managers.logic.vars["lastForagedItemDescription"] = lastForagedItem ? cards[lastForagedItem].description : null
        this.game.managers.logic.vars["lastForagedItemFlavour"] = lastForagedItem ? cards[lastForagedItem].flavour : null
        if (this.spellcrafterGame.familiar) {
            this.game.managers.logic.vars["familiar"] = this.spellcrafterGame.familiar.id;
            this.game.managers.logic.vars["familiarName"] = cards[this.spellcrafterGame.familiar.id].name;
            this.game.managers.logic.vars["familiarIdle"] = this.spellcrafterGame.familiar.busyUntil <= this.spellcrafterGame.time;
        } else {
            this.game.managers.logic.vars["familiar"] = null;
        }
        for(let i = 0; i < 3; i++) {
            if (stats.barriers >= (i+1))
                this.barrierImages[2-i].loadTexture("barrier");
            else
                this.barrierImages[2-i].loadTexture("barrier-broken");
        }
    }
}
