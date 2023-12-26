import React, { useEffect, useState } from "react";
import { MenuState } from "../Pages/gamePhaseManager";
import { HasValue, getComponentValueStrict, getComponentValue } from "@latticexyz/recs";

import "./ComponentsStyles/NavBarStyles.css";

import { ClickWrapper } from "../clickWrapper";
import { PrepPhaseStages } from "../PrepPhasePages/prepPhaseManager";
import { useDojo } from "../../hooks/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GAME_CONFIG_ID } from "../../utils/settingsConstants";

interface NavbarProps {
  menuState: MenuState;
  setMenuState: (menuState: MenuState) => void;
}

export const NavbarComponent: React.FC<NavbarProps> = ({ menuState, setMenuState }) => {

  const {
    networkLayer: {
      network: { clientComponents }
    },
  } = useDojo();

  const handleIconClick = (selectedState: MenuState) => {
    if (menuState === selectedState) {
      setMenuState(MenuState.NONE);
    } else {
      setMenuState(selectedState);
    }
  };

  const guest = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)])).guest;

  return (
    <ClickWrapper className="navbar-container">

      {guest ?
        <div className={`navbar-icon not-active`} style={{ filter: "brightness(70%) grayscale(70%)" }}>
          <img src="Icons/PROFILE.png" alt="" />
        </div>
        :
        <div className={`navbar-icon ${menuState === MenuState.PROFILE ? "active" : "not-active"}`} onClick={() => handleIconClick(MenuState.PROFILE)}>
          <img src="Icons/PROFILE.png" alt="" />
        </div>
      }

      <div className={`navbar-icon ${menuState === MenuState.STATS ? "active" : "not-active"}`} onClick={() => handleIconClick(MenuState.STATS)}>
        <img src="Icons/STATISTICS.png" alt="" />
      </div>
      <div onClick={() => handleIconClick(MenuState.SETTINGS)} className={`navbar-icon ${menuState === MenuState.SETTINGS ? "active" : "not-active"}`}>
        <img src="Icons/SETTINGS.png" alt="" />
      </div>
      <div onClick={() => handleIconClick(MenuState.TRADES)} className={`navbar-icon ${menuState === MenuState.TRADES ? "active" : "not-active"}`}>
        <img src="Icons/TRADES.png" alt="" />
      </div>
      <div className={`navbar-icon ${menuState === MenuState.RULES ? "active" : "not-active"}`} onClick={() => handleIconClick(MenuState.RULES)}>
        <img src="Icons/RULES.png" alt="" />
      </div>
    </ClickWrapper>
  );
};

interface PrepPhaseNavbarProps {
  currentMenuState: PrepPhaseStages;
  lastSavedState: PrepPhaseStages;
  setMenuState: (menuState: PrepPhaseStages) => void;
}

export const PrepPhaseNavbarComponent: React.FC<PrepPhaseNavbarProps> = ({ currentMenuState, lastSavedState, setMenuState }) => {

  const {
    networkLayer: {
      network: { clientComponents }
    },
  } = useDojo();

  const handleIconClick = (selectedState: PrepPhaseStages) => {
    if (currentMenuState === selectedState) {
      setMenuState(lastSavedState);
    } else {
      setMenuState(selectedState);
    }
  };

  const guest = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)])).guest;

  return (
    <ClickWrapper className="navbar-container" style={{ height: "15%" }}>

      {guest ?
        <div className={`navbar-icon not-active`} style={{ filter: "brightness(70%) grayscale(70%)" }}>
          <img src="Icons/PROFILE.png" alt="" />
        </div>
        :
        <div className={`navbar-icon ${currentMenuState === PrepPhaseStages.PROFILE ? "active" : "not-active"}`} onClick={() => handleIconClick(PrepPhaseStages.PROFILE)}>
          <img src="Icons/PROFILE.png" alt="" />
        </div>
      }

      <div className={`navbar-icon ${currentMenuState === PrepPhaseStages.RULES ? "active" : "not-active"}`} onClick={() => handleIconClick(PrepPhaseStages.RULES)}>
        <img src="Icons/RULES.png" alt="" />
      </div>
      <div className={`navbar-icon ${currentMenuState === PrepPhaseStages.SETTINGS ? "active" : "not-active"}`} onClick={() => handleIconClick(PrepPhaseStages.SETTINGS)}>
        <img src="Icons/SETTINGS.png" alt="" />
      </div>
    </ClickWrapper>
  );
};