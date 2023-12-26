

import { getEntityIdFromKeys, parseComponentValueFromGraphQLEntity, setComponentFromGraphQLEntity } from "@dojoengine/utils";
import { setComponent, Components, ComponentValue, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import { getTileIndex } from "../phaser/constants";
import { GAME_CONFIG_ID } from "./settingsConstants";


//region Names

export const namesArray: string[] = [
    "Mireth",
    "Vexara",
    "Zorion",
    "Caelix",
    "Elyndor",
    "Tharion",
    "Sylphren",
    "Aravax",
    "Vexil",
    "Lyrandar",
    "Nyxen",
    "Theralis",
    "Qyra",
    "Fenrix",
    "Atheris",
    "Lorvael",
    "Xyris",
    "Zephyron",
    "Calaer",
    "Drakos",
    "Velixar",
    "Syrana",
    "Morvran",
    "Elithran",
    "Kaelith",
    "Tyrven",
    "Ysara",
    "Vorenth",
    "Alarix",
    "Ethrios",
    "Nyrax",
    "Thrayce",
    "Vynora",
    "Kerith",
    "Jorvax",
    "Lysandor",
    "Eremon",
    "Xanthe",
    "Zanther",
    "Cindris",
    "Baelor",
    "Lyvar",
    "Eryth",
    "Zalvor",
    "Gormath",
    "Sylvanix",
    "Quorin",
    "Taryx",
    "Nyvar",
    "Oryth",
    "Valeran",
    "Myrthil",
    "Zorvath",
    "Kyrand",
    "Thalren",
    "Vexim",
    "Aelar",
    "Grendar",
    "Xylar",
    "Zorael",
    "Calyph",
    "Vyrak",
    "Thandor",
    "Lyrax",
    "Riven",
    "Drexel",
    "Yvaris",
    "Zenthil",
    "Aravorn",
    "Morthil",
    "Sylvar",
    "Quinix",
    "Tharix",
    "Valthorn",
    "Nythar",
    "Lorvax",
    "Exar",
    "Zilthar",
    "Cynthis",
    "Veldor",
    "Arix",
    "Thyras",
    "Mordran",
    "Elyx",
    "Kythor",
    "Rendal",
    "Xanor",
    "Yrthil",
    "Zarvix",
    "Caelum",
    "Lythor",
    "Qyron",
    "Thoran",
    "Vexor",
    "Nyxil",
    "Orith",
    "Valix",
    "Myrand",
    "Zorath",
    "Kaelor"
];

export const surnamesArray: string[] = [
    "Velindor",
    "Tharaxis",
    "Sylphara",
    "Aelvorn",
    "Morvath",
    "Elynara",
    "Xyreth",
    "Zephris",
    "Kaelyth",
    "Nyraen",
    "Lorvex",
    "Quorinax",
    "Dravys",
    "Aeryth",
    "Thundris",
    "Gryfora",
    "Luminaer",
    "Orythus",
    "Veximyr",
    "Zanthyr",
    "Caelarix",
    "Nythara",
    "Vaelorix",
    "Myrendar",
    "Zorvyn",
    "Ethrios",
    "Mordraen",
    "Xanthara",
    "Yrthalis",
    "Zarvixan",
    "Calarun",
    "Vyrakar",
    "Thandoril",
    "Lyraxin",
    "Drexis",
    "Yvarix",
    "Zenithar",
    "Aravor",
    "Morthal",
    "Sylvoran",
    "Quinixar",
    "Tharixan",
    "Valthornus",
    "Nytharion",
    "Lorvax",
    "Exarion",
    "Ziltharix",
    "Cynthara",
    "Veldoran",
    "Arxian",
    "Thyras",
    "Elyxis",
    "Kythoran",
    "Rendalar",
    "Xanorath",
    "Yrthilix",
    "Zarvixar",
    "Caelumeth",
    "Lythorix",
    "Qyronar",
    "Thoranis",
    "Vexorath",
    "Nyxilar",
    "Orithan",
    "Valixor",
    "Myrandar",
    "Zorathel",
    "Kaeloran",
    "Skyrindar",
    "Nighsearix",
    "Flamveilar",
    "Thornvalix",
    "Stormwieldor",
    "Emberwindar",
    "Ironwhisparia",
    "Ravenfrostix",
    "Shadowgleamar",
    "Frostechoar",
    "Moonriftar",
    "Starbinderix",
    "Voidshaperix",
    "Earthmeldar",
    "Sunweaverix",
    "Seablazix",
    "Wraithbloomar",
    "Windshardix",
    "Lightchasar",
    "Darkwhirlar",
    "Thornspiritix",
    "Stormglowar",
    "Firegazix",
    "Nightstreamar",
    "Duskwingar",
    "Frostrealmar",
    "Shadowsparkix",
    "Ironbloomar",
    "Ravenmistar",
    "Embermarkix",
    "Gloomveinar",
    "Moonshroudar"
];

//endregion



//region Setting Components Easy   we can just get the schema instead of doing it manually)

function createComponentStructure(componentSchema: any, keys: string[], componentName: string): any {
    return {
        "node": {
            "keys": keys,
            "models": [
                {
                    "__typename": componentName,
                    ...componentSchema
                }
            ]
        }
    };
}

export const setClientGameComponent = async (phase: number, game_id: number, current_block: number, guest: boolean, event_drawn: number, clientComponents: any) => {

    const componentSchemaClientGameData = {
        "current_game_state": phase,
        "current_game_id": game_id,
        "current_block_number": current_block,
        "guest": guest,
        "current_event_drawn": event_drawn
    };

    const craftedEdgeClientGameComp = createComponentStructure(componentSchemaClientGameData, ["0x1"], "ClientGameData");
    setComponentFromGraphQLEntity(clientComponents, craftedEdgeClientGameComp);
}

export const setClientOutpostComponent = async (id: number, owned: boolean, event_effected: boolean, selected: boolean, visible: boolean, clientComponents: any, contractComponents: any, game_id: number) => {

    // EntityTileIndex

    const componentSchemaClientOutpostData = {
        "id": id,
        "owned": owned,
        "event_effected": event_effected,
        "selected": selected,
        "visible": visible,
    };

    const craftedEdgeClientOutpostComp = createComponentStructure(componentSchemaClientOutpostData, [decimalToHexadecimal(game_id), decimalToHexadecimal(id)], "ClientOutpostData");
    setComponentFromGraphQLEntity(clientComponents, craftedEdgeClientOutpostComp);


    const outpostData = getComponentValueStrict(contractComponents.Outpost, getEntityIdFromKeys([BigInt(game_id), BigInt(id)]));
    const index = getTileIndex(outpostData.x, outpostData.y);

    const componentSchemaEntityTileIndex = {
        "tile_index": index,
    };

    const craftedEdgeEntityTileIndex = createComponentStructure(componentSchemaEntityTileIndex, [decimalToHexadecimal(game_id), decimalToHexadecimal(id)], "EntityTileIndex");
    setComponentFromGraphQLEntity(clientComponents, craftedEdgeEntityTileIndex);
}

export const loadInClientOutpostData = (game_id: number,contractComponents:any, clientComponents:any, account:any) =>
{
  const gameEntityCounter = getComponentValueStrict(contractComponents.GameEntityCounter, getEntityIdFromKeys([BigInt(game_id)]));
  const outpostCount = gameEntityCounter.outpost_count;

  for (let index = 1; index <= outpostCount; index++) {
    const entityId = getEntityIdFromKeys([BigInt(game_id), BigInt(index)]);
    
    const outpostData = getComponentValueStrict(contractComponents.Outpost, entityId);

    let owned = false;

    if (outpostData.owner === account.address) {owned = true;}
    
    setClientOutpostComponent(Number(outpostData.entity_id), owned, false, false,false,clientComponents,  contractComponents,game_id);
  }
}





/**
 * Sets the client click position component based on provided coordinates.
 * 
 * @param xFromOrigin - The x-coordinate from the origin (top left).
 * @param yFromOrigin - The y-coordinate from the origin (top left).
 * @param xFromMiddle - The x-coordinate from the middle of the screen.
 * @param yFromMiddle - The y-coordinate from the middle of the screen.
 */
export const setClientClickPositionComponent = async (xFromOrigin: number, yFromOrigin: number, xFromMiddle: number, yFromMiddle: number, clientComponents: any) => {

    const componentSchemaClientClickPosition = {
        "xFromOrigin": xFromOrigin,
        "yFromOrigin": yFromOrigin,
        "xFromMiddle": xFromMiddle,
        "yFromMiddle": yFromMiddle,
    };

    const craftedEdgeClientClickPositionComp = createComponentStructure(componentSchemaClientClickPosition, ["0x1"], "ClientClickPosition");
    setComponentFromGraphQLEntity(clientComponents, craftedEdgeClientClickPositionComp);
}

export const setClientCameraComponent = async (x: number, y: number, clientComponents: any) => {

    const componentSchemaClientCamera = {
        "x": x,
        "y": y,
    };

    const craftedEdgeClientCameraComp = createComponentStructure(componentSchemaClientCamera, ["0x1"], "ClientCameraPosition");
    setComponentFromGraphQLEntity(clientComponents, craftedEdgeClientCameraComp);
}

export const setClientCameraEntityIndex = async (x: number, y: number, clientComponents: any) => {

    const index = getTileIndex(x, y);

    const componentSchemaEntityTileIndex = {
        "tile_index": index,
    };

    const craftedEdgeEntityTileIndex = createComponentStructure(componentSchemaEntityTileIndex, ["0x1"], "EntityTileIndex");
    setComponentFromGraphQLEntity(clientComponents, craftedEdgeEntityTileIndex);

}

//endregion



export function isValidArray(input: any): input is any[] {
    return Array.isArray(input) && input != null;
}

export function getFirstComponentByType(entities: any[] | null | undefined, typename: string): any | null {
    if (!isValidArray(entities)) return null;

    for (let entity of entities) {
        if (isValidArray(entity?.node.components)) {
            const foundComponent = entity.node.components.find((comp: any) => comp.__typename === typename);
            if (foundComponent) return foundComponent;
        }
    }
    return null;
}

export function extractAndCleanKey(entities?: any[] | null | undefined): string | null {

    if (!isValidArray(entities) || !entities[0]?.keys) return null;

    return entities[0].keys.replace(/,/g, '');
}


//what?
export function addPrefix0x(input: string | number): string {
    return `0x${input}`;
}

export function decimalToHexadecimal(number: number): string {
    if (isNaN(number) || !isFinite(number)) {
        throw new Error(`Input must be a valid number ${number}`);
    }

    const hexadecimalString = number.toString(16).toUpperCase();
    return `0x${hexadecimalString}`;
}

export function hexToNumber(hexString: string): number {
    return parseInt(hexString, 16);
}



export function truncateString(inputString: string, prefixLength: number): string {
    if (inputString.length <= prefixLength) {
        return inputString; // No need to truncate if the string is already short enough
    }

    const prefix = inputString.substring(0, prefixLength);
    const suffix = inputString.slice(-3);

    return `${prefix}...${suffix}`;
}

export function setComponentsFromGraphQlEntitiesHM(data: any, components: Components, isModel: boolean): void {

    if (data === null && data === undefined) {
        console.error("something sent to the setComponent func was not correct")
        return;
    }

    for (const edge of data.edges) {

        let node = edge.node;

        if (isModel) {
            node = edge.node.entity;
        }

        const keys = node.keys.map((key: string) => BigInt(key));
        const entityIndex = getEntityIdFromKeys(keys);

        for (const model of node.models) {

            const modelKeys = Object.keys(model);
            if (modelKeys.length !== 1) {
                const componentName = model.__typename;
                const component = components[componentName];

                const componentValues = Object.keys(component.schema).reduce((acc: ComponentValue, key) => {
                    const value = model[key];
                    const parsedValue = parseComponentValueFromGraphQLEntity(value, component.schema[key]);
                    acc[key] = parsedValue;
                    return acc;
                }, {});

                console.log(componentValues)
                setComponent(component, entityIndex, componentValues);
            }
        }
    }
}

export function checkAndSetPhaseClientSide(game_id: number, currentBlockNumber: number, contractComp: any, clientComp: any): { phase: number; blockLeft: number } {
    const gameData = getComponentValue(contractComp.Game, getEntityIdFromKeys([BigInt(game_id)]));

    const gameClientData = getComponentValue(clientComp.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG_ID)]));

    let phase = 1;
    //30                           //10                         //39
    const blockLeft = (gameData.start_block_number + gameData.preparation_phase_interval) - currentBlockNumber

    if (blockLeft <= 0) {
        phase = 2;
    }

    setClientGameComponent(phase, game_id, currentBlockNumber, gameClientData.guest, gameClientData.current_event_drawn, clientComp);

    return { phase, blockLeft };
}


//there might be issues in the future where the graphql request gets too big i dont think the Models specifc request work correctly honeslty 
// it better to do the entities one


//region Fetch Requests

export const fetchGameTracker = async (graphSDK_: any): Promise<any> => {
    const {
        data: { entities },
    } = await graphSDK_().getGameTracker({ config: decimalToHexadecimal(GAME_CONFIG_ID as number) });

    return entities;
}


export const fetchGameData = async (graphSDK_: any, game_id: number): Promise<any> => {
    const {
        data: { entities },
    } = await graphSDK_().getGameData({ game_id: decimalToHexadecimal(game_id) });

    return entities;
}


export const fetchPlayerInfo = async (graphSDK_: any, game_id: number, owner: string): Promise<any> => {

    const {
        data: { entities },
    } = await graphSDK_().getPlayerInfo({ game_id: decimalToHexadecimal(game_id), owner: owner });

    return entities;
}


export const fetchAllEvents = async (graphSDK_: any, game_id: number, numOfEvents: number): Promise<any> => {

    const {
        data: { worldeventModels },
    } = await graphSDK_().getAllEvents({ game_id: game_id, eventsNumber: numOfEvents });

    return worldeventModels;
}

export const fetchSpecificEvent = async (graphSDK_: any, game_id: number, entity_id: number): Promise<any> => {

    const {
        data: { entities },
    } = await graphSDK_().fetchSpecificEvent({ game_id: decimalToHexadecimal(game_id), entity_id: decimalToHexadecimal(entity_id) });

    return entities;
}

export const fetchSortedPlayerReinforcementList = async (graphSDK_: any, game_id: number, numOfPlayers: number): Promise<any> => {

    const {
        data: { playerinfoModels },
    } = await graphSDK_().getSortedPlayerReinforcements({ game_id: game_id, playersNum: numOfPlayers });

    return playerinfoModels;
}

export const fetchAllOutRevData = async (graphSDK_: any, game_id: number, numOfObjects: number): Promise<any> => {

    const {
        data: { outpostModels },
    } = await graphSDK_().getAllOutRev({ game_id: game_id, outpostCount: numOfObjects });

    return outpostModels;
}


export const fetchAllTrades = async (graphSDK_: any, game_id: number, state: number): Promise<any> => {

    const {
        data: { tradeModels },
    } = await graphSDK_().getTradesAvailable({ game_id: game_id, tradeStatus: state });

    return tradeModels;
}


export const fetchSpecificOutRevData = async (graphSDK_: any, game_id: number, entity_id: number): Promise<any> => {

    const {
        data: { entities },
    } = await graphSDK_().fetchSpecificOutRev({ game_id: decimalToHexadecimal(game_id), entity_id: decimalToHexadecimal(entity_id) });

    return entities;
}


export const fetchAllOwnOutRevData = async (graphSDK_: any, game_id: number, numOfObjects: number, account: any): Promise<any> => {

    const {
        data: { outpostModels },
    } = await graphSDK_().getAllOwnRevOut({ game_id: game_id, outpostCount: numOfObjects, owner: account.address });

    return outpostModels;
}



//endregion
