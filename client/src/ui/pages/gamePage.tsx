import React, { useEffect, useState } from "react";

import { ClickWrapper } from "../clickWrapper";
import { Phase } from "../phaseManager";
import { useDojo } from "../../hooks/useDojo";
import { Account, num } from "starknet";
import { padHex } from "../../utils";
import { useStore } from "../../store/store";


export const GamePage: React.FC = () => {

    //for now we use a burner account
    const {
        account: { account },
        networkLayer: {
            systemCalls: { create_game },
            network: { graphSdk }
        },
    } = useDojo();

    const currentGameId = useStore((state) => state.currentGameId);

    return (
        <ClickWrapper className="centered-div" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "20px" }}>


      <div>
          Now playing {currentGameId}
      </div>      

    </ClickWrapper>
    );
};
