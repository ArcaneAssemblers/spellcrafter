//libs
import React , {useState, useEffect}from "react";
import { MenuState } from "./gamePhaseManager";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';

//styles
import "./PagesStyles/SettingPageStyle.css";
import PageTitleElement from "../Elements/pageTitleElement";
import { ClickWrapper } from "../clickWrapper";
import { Switch } from "@mui/material";
import { setRefreshOwnOutpostDataTimer } from "../../utils/settingsConstants";

//elements/components

//pages

/*notes
    should be divide in two sections 

    one for the hold of all of the transactions done this session, this will be a dict somewhere in the codebase with the key being the tx hash and the value being the current state
    this will all be set via a promise?

    the other section is a list of setting for the player to deal with camera speed and stuff like that, no real query needed for this one
    
*/


interface SettingPageProps {
    setUIState: () => void;
}

export const SettingsPage: React.FC<SettingPageProps> = ({ setUIState }) => {

    const [checkboxChecked, setCheckboxChecked] = useState(true);
    const [switchChecked, setSwitchChecked] = useState(true);
    const [sliderValue, setSliderValue] = useState(20);

    useEffect(() => {
        setRefreshOwnOutpostDataTimer(sliderValue);
    }, [sliderValue])
    

    return (
        <div className="game-page-container">
            <img className="page-img" src="./assets/Page_Bg/PROFILE_PAGE_BG.png" alt="testPic" />
            <PageTitleElement name={"SETTINGS"} rightPicture={"close_icon.svg"} closeFunction={setUIState} />

            <ClickWrapper style={{ position: "relative", width: "100%", height: "90%", display: "flex", flexDirection: "row", padding: "5% 3%", boxSizing: "border-box", color:"white"}}>
                <ClickWrapper style={{ height: "100%", width: "60%", display: "flex", flexDirection: "column", justifyContent: "center", paddingRight:"4%", boxSizing:"border-box" }}>
                    <FormControlLabel control={<Checkbox style={{ color: 'grey' }} checked={checkboxChecked} onChange={() => setCheckboxChecked(!checkboxChecked)} />} label={checkboxChecked ? "This is checked" : "this is not checked"} />

                    <FormControlLabel control={<Switch style={{ color: 'grey' }} checked={switchChecked} onChange={() => setSwitchChecked(!switchChecked)} />} label={switchChecked ? "This is switched" : "this is not switch"} />

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: 'grey', marginRight: '10px' }}>Slider Value: {sliderValue}</span>
                        <Slider style={{ color: 'grey' }} value={sliderValue} onChange={(event, newValue) => setSliderValue(newValue as number)} defaultValue={20} aria-label="Default" valueLabelDisplay="auto" max={1000} min={20} />
                    </div>
                </ClickWrapper>

                <div style={{ height: "100%", width: "40%", padding:"2% 2%" , boxSizing: "border-box", overflowY:"auto", scrollbarGutter:"stable both-edges", border:"2px solid var(--borderColour)"}}>
                    <TransactionDataElement transactionData={{state:TransactionState.PASSED, txHash:"0x272b758005aefb75e524a53f28ebc7fe1e57720c448a388746ba2eff4874e54"}} />
                    <TransactionDataElement transactionData={{state:TransactionState.WAITING, txHash:"0x272b758005aefb75e524a53f28ebc7fe1e57720c448a388746ba2eff4874e54"}} />
                    <TransactionDataElement transactionData={{state:TransactionState.FAILED, txHash:"0x272b758005aefb75e524a53f28ebc7fe1e57720c448a388746ba2eff4874e54"}} />
                    <TransactionDataElement transactionData={{state:TransactionState.PASSED, txHash:"0x272b758005aefb75e524a53f28ebc7fe1e57720c448a388746ba2eff4874e54"}} />
                    <TransactionDataElement transactionData={{state:TransactionState.WAITING, txHash:"0x272b758005aefb75e524a53f28ebc7fe1e57720c448a388746ba2eff4874e54"}} />
                    <TransactionDataElement transactionData={{state:TransactionState.FAILED, txHash:"0x272b758005aefb75e524a53f28ebc7fe1e57720c448a388746ba2eff4874e54"}} />
                    <TransactionDataElement transactionData={{state:TransactionState.PASSED, txHash:"0x272b758005aefb75e524a53f28ebc7fe1e57720c448a388746ba2eff4874e54"}} />
                    <TransactionDataElement transactionData={{state:TransactionState.WAITING, txHash:"0x272b758005aefb75e524a53f28ebc7fe1e57720c448a388746ba2eff4874e54"}} />
                    <TransactionDataElement transactionData={{state:TransactionState.FAILED, txHash:"0x272b758005aefb75e524a53f28ebc7fe1e57720c448a388746ba2eff4874e54"}} />
                    <TransactionDataElement transactionData={{state:TransactionState.PASSED, txHash:"0x272b758005aefb75e524a53f28ebc7fe1e57720c448a388746ba2eff4874e54"}} />
                    <TransactionDataElement transactionData={{state:TransactionState.WAITING, txHash:"0x272b758005aefb75e524a53f28ebc7fe1e57720c448a388746ba2eff4874e54"}} />
                    <TransactionDataElement transactionData={{state:TransactionState.FAILED, txHash:"0x272b758005aefb75e524a53f28ebc7fe1e57720c448a388746ba2eff4874e54"}} />
                </div>  
            </ClickWrapper>
        </div>
    );
};



export enum TransactionState
{
    WAITING,
    PASSED,
    FAILED
}

interface TransactionData {
    state: TransactionState,
    txHash: string,
}


export const TransactionDataElement: React.FC<{ transactionData: TransactionData }> = ({ transactionData }) => {

    const openVoyager = () => {
        window.open(`https://voyager.online/tx/${transactionData.txHash}`, '_blank');
    };

    const getH1Color = () => {
        switch (transactionData.state) {
            case TransactionState.WAITING:
                return 'blue';
            case TransactionState.PASSED:
                return 'green';
            case TransactionState.FAILED:
                return 'red';
            default:
                return 'black'; // Default color, you can change it to your preference
        }
    };

    return (
        <div style={{ height: "fit-content", width: "100%",  borderRadius:"5px", marginBottom:"10px" , padding:"5px 5px", backgroundColor:"black", color:"white", border:"2px solid var(--borderColour)", boxSizing:"border-box"}}>
            <h1 style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: getH1Color() }}>
                {transactionData.state === TransactionState.WAITING ? "Waiting Transaction" :
                    transactionData.state === TransactionState.PASSED ? "Passed Transaction" :
                        transactionData.state === TransactionState.FAILED ? "Failed Transaction" : ""}
            </h1>
            <h3 style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {transactionData.txHash}
            </h3>
            <div className="global-button-style" onClick={openVoyager}>
                See on voyager
            </div>
        </div>
    );
};




