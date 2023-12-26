//libs
import React, { useEffect } from "react";
import { HasValue, getComponentValueStrict, Has } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { MenuState } from "./gamePhaseManager";
import { useDojo } from "../../hooks/useDojo";

//styles
import "./PagesStyles/WinnerPageStyles.css";

//elements/components
import { ClickWrapper } from "../clickWrapper";

//pages


/*notes
    this page should either have a way to get the winning user or just calc but it self (for now prob just calc it)
    and then depending on if the user is the winner or not it will display a different message


    should call the jackpot function
*/

interface WinnerPageProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const WinnerPage: React.FC<WinnerPageProps> = ({ setMenuState }) => {
    const [winningAddress, setWinningAddress] = React.useState<string>("");

    const closePage = () => {
        setMenuState(MenuState.NONE);
    };

    const {
        account: { account },
        networkLayer: {
            network: { contractComponents },
        },
    } = useDojo();

    const outpostDeadQuery = useEntityQuery([HasValue(contractComponents.Outpost, { lifes: 0 })]);
    const totalOutposts = useEntityQuery([Has(contractComponents.Outpost)]);

    useEffect(() => {

        if (totalOutposts.length === 0) {
            setWinningAddress("No winner");
            return;
        }

        const difference: string[] = totalOutposts.filter(item => !outpostDeadQuery.includes(item));

        const outpostComp = getComponentValueStrict(contractComponents.Outpost, getEntityIdFromKeys([BigInt(difference[0])]));

        setWinningAddress(outpostComp.owner);

    }, []);

    const shareOnTwitter = () => {
        const message = 'I just won!';
        const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        window.open(twitterShareUrl, '_blank');
    };

    return (
        <div className="game-page-container">
            <img className="page-img brightness-down" src="./revenant_vincitore_image.png" alt="testPic" />
            <div className="content-container" style={{ position: "relative" }}>

                {winningAddress === account.address ?
                    (<>
                        <h3>Address: {winningAddress}</h3>
                        <h1>YOU ARE THE RISING REVENANT</h1>
                        <ClickWrapper className="global-button-style" style={{padding:"5px 10px"}}>Claim your jackpot</ClickWrapper>
                        <ClickWrapper className="global-button-style" style={{padding:"5px 10px"}}>Claim your contribution award</ClickWrapper>
                    </>)
                    :
                    (<>
                        <h3>Address: {winningAddress}</h3>
                        <h1>IS THE RISING REVENANT</h1>
                        <ClickWrapper className="global-button-style" style={{padding:"5px 10px"}}>Claim your contribution award</ClickWrapper>
                    </>)}

            </div>

            {winningAddress === account.address && (
                <ClickWrapper
                    style={{
                        position: "absolute",
                        bottom: "0px",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        color: "white",
                        fontFamily: "OL"
                    }}
                    onMouseDown={() => {
                        shareOnTwitter();
                    }}
                    className="pointer"
                >
                    <h1>
                        Share on
                        <img src="X_logo_white.png" style={{ marginLeft: "10px" }} className="test-embed" alt="" />
                    </h1>
                </ClickWrapper>
            )}
        </div>
    )
}
