import React, { CSSProperties } from "react";

interface CounterElementProps {
    value: number;
    setValue: (value: number) => void;
    containerStyleAddition?: CSSProperties;
    additionalButtonStyleAdd?: CSSProperties;
    textAddtionalStyle?: CSSProperties;
}

const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "15%",
    alignItems: "center",
}

const additionalButtonStyle: CSSProperties = {
    fontSize: "2rem",  
    width: "min(10%, 40px)",
    aspectRatio: "1/1",
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center",
};


const CounterElement: React.FC<CounterElementProps> = ({ value, setValue, containerStyleAddition, additionalButtonStyleAdd, textAddtionalStyle }) => {
    return (
        <div style={{ ...containerStyle, ...containerStyleAddition }}>
            <div className="global-button-style" onMouseDown={() => { setValue(value - 1) }} style={{ ...additionalButtonStyle, ...additionalButtonStyleAdd }}> 
                <img src="/minus.png" alt="minus" style={{width: "100%", height: "100%"}}/>
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "100", fontFamily: "OL", ...textAddtionalStyle}}>{value}</h2>
            <div className="global-button-style" onMouseDown={() => { setValue(value + 1) }} style={{...additionalButtonStyle, ...additionalButtonStyleAdd}}> 
                <img src="/plus.png" alt="plus" style={{width: "100%", height: "100%"}}/>
            </div>
        </div>
    );
};

export default CounterElement;


