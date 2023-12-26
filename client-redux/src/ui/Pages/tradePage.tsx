//libs
import { ClickWrapper } from "../clickWrapper"
import { MenuState } from "./gamePhaseManager";
import { useEffect, useState } from "react"
import { Switch } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { getComponentValueStrict, HasValue, Has } from '@latticexyz/recs';
import { useEntityQuery } from '@latticexyz/react';

import FormControlLabel from '@mui/material/FormControlLabel';


//styles
import "./PagesStyles/TradesPageStyles.css"


//elements/components
import PageTitleElement from "../Elements/pageTitleElement"

import { useDojo } from "../../hooks/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { fetchAllTrades, truncateString } from "../../utils";
import { CreateTradeFor1Reinf, PurchaseTradeReinf, RevokeTradeReinf } from "../../dojo/types";
import { GAME_CONFIG_ID, MAP_HEIGHT } from "../../utils/settingsConstants";
import { Trade, TradeEdge, World__Entity } from "../../generated/graphql";
import { Maybe } from "graphql/jsutils/Maybe";


//pages


// this is all a mess

/*notes
 this will be a query system but it wont be a query of the saved components instead it will be straight from the graphql return as its done in beer baroon, this is 
 to save on a little of space 

 this whle page is a mess
*/


enum ShopState {
    OUTPOST,
    REINFORCES
}

interface TradesPageProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const TradesPage: React.FC<TradesPageProps> = ({ setMenuState }) => {

    const [shopState, setShopState] = useState<ShopState>(ShopState.OUTPOST);

    const closePage = () => {
        setMenuState(MenuState.NONE);
    };

    return (
        <div className="game-page-container">

            <img className="page-img" src="./assets/Page_Bg/TRADES_PAGE_BG.png" alt="testPic" />
            <PageTitleElement name={"TRADES"} rightPicture={"close_icon.svg"} closeFunction={() => { closePage() }} ></PageTitleElement>

            <ClickWrapper style={{ display: "flex", flexDirection: "row", gap: "3%", position: "relative", width: "100%", height: "10%", fontSize: "1.6cqw" }}>
                <div onClick={() => setShopState(ShopState.OUTPOST)} style={{ opacity: shopState !== ShopState.OUTPOST ? 0.5 : 1, display: "flex", justifyContent: "flex-end", flex: "1" }}>
                    <div className="global-button-style" style={{ textAlign: "center", backgroundColor: "#2C2C2C", display: "flex", justifyContent: "center", alignItems: "center", padding: "2px 20px", width: "50%", boxSizing: "border-box", height: "fit-content", fontFamily: "Zelda", fontWeight: "100" }} > OUTPOSTS</div>
                </div>
                <div onClick={() => setShopState(ShopState.REINFORCES)} style={{ opacity: shopState !== ShopState.REINFORCES ? 0.5 : 1, display: "flex", justifyContent: "flex-start", flex: "1" }}>
                    <div className="global-button-style" style={{ textAlign: "center", backgroundColor: "#2C2C2C", display: "flex", justifyContent: "center", alignItems: "center", padding: "2px 20px", width: "50%", boxSizing: "border-box", height: "fit-content", fontFamily: "Zelda", fontWeight: "100" }} > REINFORCEMENTS</div>
                </div>
            </ClickWrapper>

            <div style={{ width: "100%", height: "5%", position: "relative" }}></div>
            <ClickWrapper style={{ width: "100%", height: "70%", position: "relative", display: "flex", justifyContent: "space-between", flexDirection: "row", padding: "10px" }}>

                {shopState === ShopState.OUTPOST ? (
                    <OutpostTradeWindow />

                ) : (
                    <ReinforcementTradeWindow />
                )}

            </ClickWrapper>
            <div style={{ width: "100%", height: "5%", position: "relative" }}></div>

        </div>
    )
}




interface ItemListingProp {
    guest: number
    entityData: any
    game_id: number
}

// this should take the trade id 
const OutpostListingElement: React.FC<ItemListingProp> = ({ guest, entityData, game_id }) => {

    const [shieldsAmount, setShieldsAmount] = useState<number>(5);
    //get the data of the outpost and trade

    return (
        <div className="outpost-sale-element-container">
            <div className="outpost-grid-pic">
                <img src="test_out_pp.png" className="test-embed" alt="" style={{ width: "100%", height: "100%" }} />
            </div>

            <div className="outpost-grid-shield center-via-flex">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "2px", width: "100%", height: "50%" }}>
                    {Array.from({ length: 5 }, (_, index) => (
                        index < shieldsAmount ? (
                            <img key={index} src="SHIELD.png" alt={`Shield ${index + 1}`} style={{ width: "100%", height: "100%" }} />
                        ) : (
                            <div key={index} style={{ width: "100%", height: "100%" }} />
                        )
                    ))}
                </div>
            </div>

            <div className="outpost-grid-id outpost-flex-layout "># 74</div>
            <div className="outpost-grid-reinf-amount outpost-flex-layout ">Reinforcement: 54</div>
            <div className="outpost-grid-owner outpost-flex-layout" >Owner: 0x636...13</div>
            <div className="outpost-grid-show outpost-flex-layout ">
                <h3 style={{ backgroundColor: "#2F2F2F", padding: "3px 5px" }}>Show on map</h3>
            </div>
            <div className="outpost-grid-cost outpost-flex-layout ">Price: $57 LORDS</div>
            <div className="outpost-grid-buy-button center-via-flex">
                {guest ? (<h3 style={{ fontWeight: "100", fontFamily: "Zelda", color: "black", filter: "brightness(70%) grayscale(70%)" }}>BUY NOW</h3>) : (<h3 style={{ fontWeight: "100", fontFamily: "Zelda", color: "black" }}>BUY NOW</h3>)}
            </div>
        </div>
    )
}


const ReinforcementListingElement = ({ trade }: { trade: Maybe<World__Entity> | undefined }) => {
    const trade_model = trade?.models?.find((m) => m?.__typename == 'Trade') as Trade;

    const {
        account: { account },
        networkLayer: {
            network: { clientComponents },
            systemCalls: { revoke_trade_reinf, purchase_trade_reinf }
        },
    } = useDojo();

    const clientGameDate = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));

    const revokeTrade = () => {
        const revokeTradeProp: RevokeTradeReinf = {
            account: account,
            game_id: clientGameDate.current_game_id,
            trade_id: trade_model?.entity_id,
        }

        revoke_trade_reinf(revokeTradeProp);
    }

    const buyTrade = () => {
        const buyTradeProp: PurchaseTradeReinf = {
            account: account,
            game_id: clientGameDate.current_game_id,
            trade_id: trade_model?.entity_id,
            revenant_id: 1
        }

        purchase_trade_reinf(buyTradeProp)
    }

    if (trade_model?.status !== 1) {
        return (<></>)
    }

    return (
        <ClickWrapper className="reinforcement-sale-element-container ">
            <div className="reinf-grid-wallet center-via-flex">Maker: {truncateString(trade_model?.seller, 5)}</div>
            <div className="reinf-grid-reinf-amount center-via-flex"><img src="reinforcements_logo.png" className="test-embed" alt="" /> Reinforcements: {trade_model?.count}</div>
            <div className="reinf-grid-cost center-via-flex">Price: ${trade_model?.price} LORDS</div>
            {clientGameDate.guest ? (<div className="reinf-grid-buy-button center-via-flex" style={{ filter: "brightness(70%) grayscale(70%)" }}>BUY NOW</div>) :
                (
                    <>
                        {account.address === trade_model.seller ? <div className="reinf-grid-buy-button center-via-flex pointer" onClick={() => revokeTrade()} >REVOKE</div> : <div className="reinf-grid-buy-button center-via-flex pointer" onClick={() => buyTrade()}>BUY NOW</div>}
                    </>
                )
            }
        </ClickWrapper >
    );
};





// const ReinforcementListingElement: React.FC<ItemListingProp> = ({ guest, entityData, game_id }) => {

//     const [maker, setMaker] = useState("");
//     const [count, setCount] = useState(0);
//     const [cost, setCost] = useState(0);
//     const [id, setId] = useState(0);

//     const {
//         account: { account },
//         networkLayer: {
//             network: { clientComponents, graphSdk, contractComponents },
//             systemCalls: { create_trade_reinf, revoke_trade_reinf, purchase_trade_reinf }
//         },
//     } = useDojo();

//     useEffect(() => {
//         const tradeData = getComponentValueStrict(contractComponents.Trade, entityData);

//         setMaker(tradeData.seller.toString());
//         setCount(tradeData.count);
//         setCost(tradeData.price);

//         setId(tradeData.entity_id)
//     }, [])


//     const revokeTrade = () => {
//         const revokeTradeProp: RevokeTradeReinf = {
//             account: account,
//             game_id: game_id,
//             trade_id: id,
//         }

//         revoke_trade_reinf(revokeTradeProp);
//     }

//     const buyTrade = () => {
//         const buyTradeProp: PurchaseTradeReinf = {
//             account: account,
//             game_id: game_id,
//             trade_id: id,
//             revenant_id: 1
//         }

//         purchase_trade_reinf(buyTradeProp)
//     }

//     return (
//         <ClickWrapper className="reinforcement-sale-element-container ">
//             <div className="reinf-grid-wallet center-via-flex">Maker: {truncateString(maker, 5)}</div>
//             <div className="reinf-grid-reinf-amount center-via-flex"><img src="reinforcements_logo.png" className="test-embed" alt="" /> Reinforcements: {count}</div>
//             <div className="reinf-grid-cost center-via-flex">Price: ${cost} LORDS</div>
//             {guest ? (<div className="reinf-grid-buy-button center-via-flex" style={{ filter: "brightness(70%) grayscale(70%)" }}>BUY NOW</div>) :
//                 (
//                     <>
//                         {account.address === maker ? <div className="reinf-grid-buy-button center-via-flex pointer" onClick={() => revokeTrade()} >REVOKE</div> : <div className="reinf-grid-buy-button center-via-flex pointer" onClick={() => buyTrade()}>BUY NOW</div>}
//                     </>
//                 )
//             }
//         </ClickWrapper >
//     )
// }

// https://github.com/cartridge-gg/beer-baron/blob/main/client/src/ui/modules/TradeTable.tsx

// use this somewhere
// const interval = setInterval(() => {
//     view_beer_price({ game_id, item_id: beerType })
//         .then(price => setPrice(price))
//         .catch(error => console.error('Error fetching hop price:', error));
// }, 5000);


const OutpostTradeWindow: React.FC = () => {

    const [outpostSortingState, setOutpostSortingState] = useState<string>("none");

    const [showOwnTrades, setShowOwnTrades] = useState<boolean>(false);
    const [showOthersTrades, setShowOthersTrades] = useState<boolean>(false);
    const [order, setOrder] = useState<number>(0);

    const [sliderValue, setSliderValue] = useState(0);

    const [idInputValue, setIdInputValue] = useState<string>('');

    const [xInputValue, setXInputValue] = useState<number>(1000);
    const [yInputValue, setYInputValue] = useState<number>(1000);

    const [multiValue, setMultiValue] = useState<number[]>([0, 20]);

    const {
        networkLayer: {
            network: { clientComponents },
        },
    } = useDojo();

    // const clientGameData = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG)]));

    const handleMultiValueChange = (event: Event, newValue: number | number[]) => {
        setMultiValue(newValue as number[]);
    };

    // const [arrayOfOutpostTrades] = useState<enitty> there is a specific way to do this look at beer baron

    const handleEnterPress = () => {
        const numbersArray = idInputValue.split('/');

        const filteredNumbers = numbersArray
            .filter(item => /^[0-9]+$/.test(item))
            .map(Number);

        const uniqueNumbers = Array.from(new Set(filteredNumbers));

        console.log(uniqueNumbers);
    };

    const handleOutpostSortChange = (event: SelectChangeEvent) => {
        setOutpostSortingState(event.target.value);
    };

    useEffect(() => {
    }, [showOthersTrades])

    useEffect(() => {
    }, [showOwnTrades])

    useEffect(() => {

        if (xInputValue < 0) {
            setXInputValue(0);
        }

        if (yInputValue < 0) {
            setYInputValue(0);
        }

    }, [xInputValue, yInputValue])

    return (
        <>
            <div style={{ backgroundColor: "grey", height: "100%", width: "25%", display: "grid", gridTemplateRows: "repeat(8, 1fr", padding: "2% 3%", boxSizing: "border-box" }}>
                <div style={{ gridRow: "1/2" }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Sort Method</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={outpostSortingState}
                            label="Age"
                            onChange={handleOutpostSortChange}>

                            <MenuItem value={"none"}>None</MenuItem>
                            <MenuItem value={"reinf"}>Reinforcement</MenuItem>
                            <MenuItem value={"pos"}>Position</MenuItem>
                            <MenuItem value={"cost"}>Cost</MenuItem>
                            <MenuItem value={"id"}>Id</MenuItem>

                        </Select>
                    </FormControl>
                </div>
                <div style={{ gridRow: "2/7", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>

                    {outpostSortingState === "reinf" && (<>

                        <Slider
                            getAriaLabel={() => 'Reinf range'}
                            value={multiValue}
                            onChange={handleMultiValueChange}
                            valueLabelDisplay="auto"
                            max={20}
                            min={1}
                        />
                        <h2>min {multiValue[0]}</h2>
                        <h2>max {multiValue[1]}</h2>

                    </>)}

                    {/* ------------------------------------ */}


                    {outpostSortingState === "pos" && (<>
                        <h2>set the middle pos of the desired outpost</h2>

                        <input
                            type="number"
                            className="grid-searchbox-custom-input"
                            style={{ height: "10%" }}
                            value={xInputValue}
                            onChange={(e) => setXInputValue(Number(e.target.value))}
                            placeholder="X value"
                        />

                        <input
                            type="number"
                            className="grid-searchbox-custom-input"
                            style={{ height: "10%" }}
                            value={yInputValue}
                            onChange={(e) => setYInputValue(Number(e.target.value))}
                            placeholder="Y value"
                        />

                        <div style={{ display: 'flex', alignItems: 'center', padding: "5px 10px", width: "90%", boxSizing: "border-box" }}>
                            <span style={{ color: 'blue', marginRight: '10px' }}>Slider Value: {sliderValue}</span>
                            <Slider style={{ color: 'blue' }} value={sliderValue} onChange={(event, newValue) => setSliderValue(newValue as number)} defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={MAP_HEIGHT} min={0} />
                        </div>

                    </>)}


                    {/* ------------------------------------ */}


                    {outpostSortingState === "cost" && (<>

                        <Slider
                            getAriaLabel={() => 'Cost'}
                            value={multiValue}
                            onChange={handleMultiValueChange}
                            valueLabelDisplay="auto"
                            max={9999}
                            min={1}
                        />
                        <h2>min {multiValue[0]}</h2>
                        <h2>max {multiValue[1]}</h2>
                    </>)}


                    {/* ------------------------------------ */}


                    {outpostSortingState === "id" && (<>
                        <h2>To look for specific set of currently listed Outpost</h2>

                        <h2>To look for multiple IDs use / to split the text. eg. 23/34/65</h2>

                        <input
                            type="text"
                            className="grid-searchbox-custom-input"
                            value={idInputValue}
                            onChange={(e) => setIdInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleEnterPress()}
                            placeholder="Search by Id"
                        />

                    </>)}

                </div>

                <div style={{ gridRow: "7/8", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                    <div style={{ flex: "1", width: "100%" }} className="center-via-flex">
                        <FormControlLabel control={<Switch style={{ color: 'grey' }} checked={showOthersTrades} onChange={() => setShowOthersTrades(!showOthersTrades)} />} label={"show others trades"} />
                    </div>
                    <div style={{ flex: "1", width: "100%" }} className="center-via-flex">
                        <FormControlLabel control={<Switch style={{ color: 'grey' }} checked={showOwnTrades} onChange={() => setShowOwnTrades(!showOwnTrades)} />} label={"show own trades"} />
                    </div>

                    <div style={{ flex: "1", width: "100%" }} className="center-via-flex">
                        <FormControlLabel control={<Switch style={{ color: 'grey' }} checked={showOwnTrades} onChange={() => setOrder(order + 1)} />} label={"Invert order"} />
                    </div>
                </div>

                <div style={{ gridRow: "8/9" }} className="center-via-flex">
                    {outpostSortingState !== "none" && <div className="global-button-style" style={{ padding: "5px 10px" }}>Filter</div>}
                </div>

            </div>

            <div style={{
                height: "100%", width: "70%", padding: "10px", overflowY: "auto", scrollbarGutter: "stable",
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px", fontFamily: "OL", justifyItems: "center"
            }}>
                {/* <OutpostListingElement guest={clientGameData.guest}/>
                <OutpostListingElement guest={clientGameData.guest}/>
                <OutpostListingElement guest={clientGameData.guest}/>
                <OutpostListingElement guest={clientGameData.guest}/>
                <OutpostListingElement guest={clientGameData.guest}/>
                <OutpostListingElement guest={clientGameData.guest}/>
                <OutpostListingElement guest={clientGameData.guest}/> */}
            </div>
        </>
    )
}


const ReinforcementTradeWindow: React.FC = () => {

    const [inputValue, setInputValue] = useState<string>('');
    const [refresh, setRefresh] = useState<boolean>(false);

    const [tradeList, setTradeList] = useState<any | undefined[]>([]);

    const {
        account: { account },
        networkLayer: {
            network: { clientComponents, graphSdk },
            systemCalls: { create_trade_reinf }
        },
    } = useDojo();

    const handleEnterPress = () => {
        console.log(inputValue);
    };

    const clientGameData = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));

    useEffect(() => {

        const trades = async () => {

            const gameTrackerData = await fetchAllTrades(graphSdk, clientGameData.current_game_id, 1);
            return setTradeList(gameTrackerData?.edges);
        };
        trades();

    }, [refresh])


    const createOneTrade = async () => {

        const createTradeProp: CreateTradeFor1Reinf =
        {
            account: account,
            game_id: clientGameData.current_game_id,
            count: 1,
            price: 11,
        }

        await create_trade_reinf(createTradeProp);
    }

    return (
        <>
            <div style={{ backgroundColor: "grey", height: "100%", width: "25%", display: "grid", gridTemplateRows: "repeat(8, 1fr", padding: "2% 3%", boxSizing: "border-box" }}>
                <ClickWrapper style={{ gridRow: "1/2" }}>
                    <div onClick={() => createOneTrade()} className="pointer global-button-style">create 1 reinforcement trade</div>
                    <div onClick={() => setRefresh(!refresh)} className="pointer global-button-style">Refresh data</div>
                </ClickWrapper>
                <div style={{ gridRow: "2/7", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>


                    {/* ------------------------------------ */}


                    {/* ------------------------------------ */}


                    {/* ------------------------------------ */}


                </div>

                <div style={{ gridRow: "7/8", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>

                    <div style={{ flex: "1", width: "100%" }} className="center-via-flex">
                        {/* <FormControlLabel control={<Switch style={{ color: 'grey' }} checked={showOthersTrades} onChange={() => setShowOthersTrades(!showOthersTrades)} />} label={"show others trades"} /> */}
                    </div>

                    <div style={{ flex: "1", width: "100%" }} className="center-via-flex">
                        {/* <FormControlLabel control={<Switch style={{ color: 'grey' }} checked={showOwnTrades} onChange={() => setShowOwnTrades(!showOwnTrades)} />} label={"show own trades"} /> */}
                    </div>

                    <div style={{ flex: "1", width: "100%" }} className="center-via-flex">
                        {/* <FormControlLabel control={<Switch style={{ color: 'grey' }} checked={showOwnTrades} onChange={() => setOrder(order + 1)} />} label={"Invert order"} /> */}
                    </div>
                </div>

                <div style={{ gridRow: "8/9" }} className="center-via-flex">
                    {/* {outpostSortingState !== "none" && <div className="global-button-style" style={{ padding: "5px 10px" }}>Filter</div>} */}
                </div>

            </div>

            <div style={{
                height: "100%", width: "70%", padding: "10px", overflowY: "auto", scrollbarGutter: "stable"
            }}>

                {tradeList.map((trade: TradeEdge, index: number) => {
                    return <ReinforcementListingElement trade={trade.node?.entity} key={index} />;
                })}
                {/* {tradeEntQuery.map((tradeID, index) => (
                        <ReinforcementListingElement guest={clientGameData.guest} entityData={tradeID} key={index} game_id={clientGameData.current_game_id}/>
                ))} */}

            </div>
        </>
    )
}

