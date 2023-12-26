// libs
import React, { useState, useEffect } from "react";

// styles


// components
import { PrepPhaseStages } from "./prepPhaseManager";
import { ClickWrapper } from "../clickWrapper";

interface WaitForTransactionPageProps {
    setMenuState: React.Dispatch<PrepPhaseStages>;
}

export const WaitForTransactionPage: React.FC<WaitForTransactionPageProps> = ({ setMenuState }) => {
    const [ellipsisCount, setEllipsisCount] = useState(0);

    const updateEllipsis = () => {
        setEllipsisCount((prevCount) => (prevCount < 3 ? prevCount + 1 : 0));
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            
            updateEllipsis();
        }, 500);

        updateEllipsis();
        return () => clearInterval(intervalId);
    }, []);


    // this should be a promise based on the transaction being made
    useEffect(() => {

        const timeoutId = setTimeout(() => {
            setMenuState(PrepPhaseStages.BUY_REIN);
        }, 5000);
        
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <ClickWrapper className="game-page-container" style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
        <img className="page-img" src="./assets/Page_Bg/JOURNAL_PAGE_BG.png" alt="testPic" />

            <h1 style={{position:"relative", textAlign:"center", fontFamily:"Zelda", fontSize:"3cqw", color:"white", fontWeight:"100"}}>
                YOUR REVENANTS ARE BEING SUMMONED <br /> READY TO CREATE AN OUTPOST
                <span >
                    {Array.from({ length: ellipsisCount }, (_, index) => (
                        <span key={index}>.</span>
                    ))}
                </span>
            </h1>
        </ClickWrapper>
    );
};
