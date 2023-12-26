import React, { CSSProperties } from "react";
import { ClickWrapper } from "../clickWrapper";

interface CounterElementProps {
    name: string;
    rightPicture: string;

    closeFunction: () => void;

    left_html_elemt?: JSX.Element;
    right_html_element?: JSX.Element;
}

const containerStyle: CSSProperties = {
    width: "100%",
    height : "10%",
    
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    
    position: "relative",

    color: "white",

    boxSizing: "border-box",
}

const leftContainerStyle: CSSProperties = {
    flex: "1",
    height: "100%",

    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
}

const rightContainerStyle: CSSProperties = {
    flex: "1",
    height: "100%",

    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
}

const titleContainerStyle: CSSProperties = {
    flex: "1",
    height: "100%",

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    fontSize: "1cqw",
    fontFamily: "Zelda",
}

const PageTitleElement: React.FC<CounterElementProps> = ({ name , rightPicture, closeFunction, left_html_elemt, right_html_element: right_html_elemt}) => {
    return (
        <ClickWrapper style={containerStyle}>
            <div style={leftContainerStyle}>
                {left_html_elemt}
            </div>
            <div style={titleContainerStyle}>
                <h1 style={{fontWeight:"100"}}>{name}</h1>
            </div>
            <div style={rightContainerStyle}>
                {right_html_elemt}
                <img src={rightPicture} alt="" style={{ height:"100%"}} className="pointer" onMouseDown={closeFunction}/>
            </div>
        </ClickWrapper>
    );
};

export default PageTitleElement;


