//libs
import React, { useState } from "react";
import { MenuState } from "./gamePhaseManager";

//styles
import "./PagesStyles/RulesPageStyles.css"
import PageTitleElement from "../Elements/pageTitleElement";
import { ClickWrapper } from "../clickWrapper";

//elements/components

//pages

/*notes
should just be a block of text with the rules not really much to do here
only issue might be with the set menu state
*/
enum RulesState {
    PREP,
    GAME,
    FINAL
}

interface RulesPageProps {
    setUIState: () => void;
}

export const RulesPage: React.FC<RulesPageProps> = ({ setUIState }) => {
    //could query game phase at start
    const [rulesState, setRulesState] = useState<RulesState>(RulesState.PREP);

    return (
        <div className="game-page-container">
            <img className="page-img" src="./assets/Page_Bg/RULES_PAGE_BG.png" alt="testPic" />
            <PageTitleElement name={"RULES"} rightPicture={"close_icon.svg"} closeFunction={setUIState} ></PageTitleElement>

            <ClickWrapper style={{ display: "flex", flexDirection: "row", gap: "20px", position: "relative", width: "100%", height: "10%", fontSize: "1.6cqw", justifyContent: "center", alignItems: "center" }}>
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                    <div className="global-button-style" onClick={() => { setRulesState(RulesState.PREP) }} style={{ opacity: rulesState !== RulesState.PREP ? 0.5 : 1, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", padding: "2px 20px", boxSizing: "border-box", height: "fit-content", fontFamily: "Zelda", fontWeight: "100" }} > PREP PHASE</div>
                </div>
                <div style={{ width:"fit-content", display: "flex", justifyContent: "center" }}>
                    <div className="global-button-style" onClick={() => { setRulesState(RulesState.GAME) }} style={{ opacity: rulesState !== RulesState.GAME ? 0.5 : 1, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", padding: "2px 20px", boxSizing: "border-box", height: "fit-content", fontFamily: "Zelda", fontWeight: "100" }} > GAME PHASE</div>
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
                    <div className="global-button-style" onClick={() => { setRulesState(RulesState.FINAL) }} style={{ opacity: rulesState !== RulesState.FINAL ? 0.5 : 1, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", padding: "2px 20px", boxSizing: "border-box", height: "fit-content", fontFamily: "Zelda", fontWeight: "100" }} > FINAL REWARD</div>
                </div>
            </ClickWrapper>


            <div style={{ width: "100%", height: "5%", position: "relative" }}></div>
            <ClickWrapper style={{ width: "100%", height: "70%", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ width: "80%", height: "100%", color: "white", fontFamily: "OL", overflowY: "auto", scrollbarGutter: "stable", paddingRight: "5px" }}>

                    {rulesState === RulesState.PREP && (<>
                        <h2 style={{ marginBottom: "0px", fontWeight: "bold" }}>Summoning the Revenants:</h2>
                        <h3 style={{ marginTop: "0px" }}> Players begin by summoning Revenants, powerful entities, through a mystical expenditure of $LORDS. Each successful summoning not only brings forth a Revenant but also establishes an Outpost around the game map.</h3>

                        <h2 style={{ marginBottom: "0px", fontWeight: "bold" }}>Building Outposts:</h2>
                        <h3 style={{ marginTop: "0px" }}>These bastions of power will initially have 1 health. Following a Revenant's summoning, players may fortify these Outposts in the following phase.</h3>

                        <h2 style={{ marginBottom: "0px", fontWeight: "bold" }}>Fortifying Outposts:</h2>
                        <h3 style={{ marginTop: "0px" }}>Outposts, symbols of your burgeoning empire, can be bolstered up to 20 times in their lifetime. The extent of reinforcements directly influences the Outpost’s defense, manifested in the number of shields it wields:<br />
                            1-2 reinforcements: Unshielded<br />
                            3-5 reinforcements: 1 shield<br />
                            6-9 reinforcements: 2 shields<br />
                            9-13 reinforcements: 3 shields<br />
                            14-19 reinforcements: 4 shields<br />
                            20 reinforcements: 5 shields</h3>

                        <h2 style={{ marginBottom: "0px", fontWeight: "bold" }}>The Anticipation Screen:</h2>
                        <h3 style={{ marginTop: "0px", fontWeight: "bold" }}>Post-preparation, players enter a phase of strategic anticipation. Here, the summoning of new Revenants and bolstering of Outposts continues, setting the stage for the impending Main Phase.</h3>
                    </>)}

                    {rulesState === RulesState.GAME && (<>
                        <h2 style={{ marginBottom: "0px" }}>Commencing the Main Phase:</h2>
                        <h3 style={{ marginTop: "0px" }}> Following the initial phase, the game escalates into a whirlwind of action, marked by attacks and disorder.</h3>

                        <h2 style={{ marginBottom: "0px" }}>Diverse Attacks:</h2>
                        <h3 style={{ marginTop: "0px" }}>Players must confront challenges ranging from cataclysmic natural disasters to the fiery wrath of dragons and the cunning onslaught of goblins.</h3>

                        <h2 style={{ marginBottom: "0px" }}>Endurance of Outposts:</h2>
                        <h3 style={{ marginTop: "0px" }}> The resilience of an Outpost is key, with its survival odds escalating with every reinforcement. The ultimate ambition? To stand as the last Rising Revenant.</h3>


                    </>)}
                    {rulesState === RulesState.FINAL && (<>
                        <h2 style={{ marginBottom: "0px" }}>Final Rewards:</h2>
                        <h2 style={{ marginBottom: "0px" }}>The Ultimate Prize:</h2>
                        <h3 style={{ marginTop: "0px" }}> The game’s transactions feed into a colossal final jackpot, destined for the sole Revenant who outlasts all others.</h3>

                        <h2 style={{ marginBottom: "0px" }}>Economic Dynamics of "Rising Revenant":</h2>
                        <h2 style={{ marginBottom: "0px" }}>Preparation Phase::</h2>
                        <h3 style={{ marginTop: "0px" }}>75% of $LORDS channeled into the final jackpot <br/> 10% allocated to transaction confirmation <br/> 15% as a creator tribute</h3>

                        <h2 style={{ marginBottom: "0px" }}>Main Phase:</h2>
                        <h3 style={{ marginTop: "0px" }}> 90% of $LORDS flows to the trader <br/> 5% augments the final jackpot <br/> 5% reserved as a lasting reward for the enduring players</h3>

                        <h2 style={{ marginBottom: "0px" }}></h2>
                        <h3 style={{ marginTop: "0px" }}>These rules are your compass in the world of "Rising Revenant," guiding you through a labyrinth of summoning, defense, and cunning trade to claim the crown of the ultimate survivor.</h3>
                        
                    </>)}

                </div>
            </ClickWrapper>
            <div style={{ width: "100%", height: "5%", position: "relative" }}></div>
        </div>
    )
}
