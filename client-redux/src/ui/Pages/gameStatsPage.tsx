//libs
import React, { useEffect } from "react";
import { MenuState } from "./gamePhaseManager";

//styles
import "./PagesStyles/StatsPageStyle.css";
import "../../App.css"

//elements/components
import { ClickWrapper } from "../clickWrapper";
import PageTitleElement from "../Elements/pageTitleElement";

//pages

/*notes
    this will have 3 lists, each list can be refreshed and sorted

    the lists might be best to keep them not as elements but just do them here

    with graphql we can sort within the query so that might be the best way to do it
    query {
  getEntities(sortBy: "variableToSort", sortOrder: "ASC") {
    id
    name
    variableToSort
  }
}

    but this is to look into

    the lists will be strongest outpost which will be based on the lifes it has (this will be a query)
    if the user wants to sort the other way then maybe we need to get rid of everythign that has 0 lifes and then sort the rest

    major lords which will be based on the amount of outposts they have (this will not be a query instead just a normal loop)

    the lords with the most reinforcements sent to them (this will be a query)

    the lists can be their own comps

there is a specific query to call and to test so to makethe whole sorting on the databsae instead of the client side
*/




interface StatsPageProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const StatsPage: React.FC<StatsPageProps> = ({ setMenuState }) => {

    const [reloadArrOne, setReloadArrOne] = React.useState<boolean>(false);
    const [reloadArrTwo, setReloadArrTwo] = React.useState<boolean>(false);

    const closePage = () => {
        setMenuState(MenuState.NONE);
    };

    const sortList = () => { };

    const refreshList = () => { };


    useEffect(() => {

        //reload this data
        if (reloadArrOne === false)
        {
            setReloadArrOne(true);

        }

        //reload this data
        if (reloadArrTwo === false)
        {
            setReloadArrTwo(true);
        }



    }, [reloadArrOne, reloadArrTwo]);

    return (
        <ClickWrapper className="game-page-container">

            <img className="page-img" src="./assets/Page_Bg/STATS_PAGE_BG.png" alt="testPic" />

            <PageTitleElement name={"STATISTICS"} rightPicture={"close_icon.svg"} closeFunction={closePage} ></PageTitleElement>

            <div className="content-section" style={{ position: "relative" }}>
                <div className="stats-section">
                    <div className="list-container">
                        <ListTitleComponent name="STRONGEST OUTPOST" sortFunction={sortList} refreshFunction={refreshList} />

                        <div className="item-container">

                            {/* this is where the items go btw */}
                        </div>
                    </div>
                </div>
                <div className="stats-section">
                    <div className="list-container">

                        <ListTitleComponent name="MAJOR LORDS" sortFunction={sortList} refreshFunction={refreshList} />

                        <div className="item-container">
                            <div className="item">NAME OF FIELD</div>
                            <div className="item">NAME OF FIELD</div>
                            <div className="item">NAME OF FIELD</div>
                            <div className="item">NAME OF FIELD</div>
                            <div className="item">NAME OF FIELD</div>
                            <div className="item">NAME OF FIELD</div>
                            <div className="item">NAME OF FIELD</div>
                            <div className="item">NAME OF FIELD</div>
                            <div className="item">NAME OF FIELD</div>
                            <div className="item">NAME OF FIELD</div>
                            <div className="item">NAME OF FIELD</div>
                        </div>
                    </div>
                </div>
                <div className="stats-section">

                </div>
            </div>

        </ClickWrapper>
    );
};


interface ListTitleProps {
    name: string;
    sortFunction: () => void;
    refreshFunction: () => void;
}

const ListTitleComponent: React.FC<ListTitleProps> = ({ name, sortFunction, refreshFunction }) => {
    return (
        <div className="list-title-section" style={{backgroundColor:"red"}}>
            <div className="list-title-text" > <h2 style={{margin:"0px",fontFamily:"OL", fontWeight:"100", fontSize:"0.9vw", color:"white"}}>{name}</h2></div>
            <div className="list-title-Icon-ref center-via-flex">
                <img style={{height:"100%", width:"100%"}}  src="refreshIcons.png" alt="add button" onMouseDown={() => { refreshFunction() }} />
            </div>
            <div className="list-title-Icon-sort center-via-flex">
                <img style={{height:"100%", width:"100%"}} src="LOGO_WHITE.png" alt="add button" onMouseDown={() => { sortFunction() }} />
            </div>
        </div>
    )
}



