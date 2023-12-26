import { Account, num } from "starknet";

export interface SystemSigner {
    account: Account
}

export interface CreateGameProps extends SystemSigner {
    preparation_phase_interval: num.BigNumberish;
    event_interval: num.BigNumberish;
    erc_addr: num.BigNumberish;
    reward_pool_addr: num.BigNumberish;
    revenant_init_price: num.BigNumberish;
    max_amount_of_revenants: num.BigNumberish;
}

export interface CreateRevenantProps extends SystemSigner {
    game_id: num.BigNumberish;
}

export interface PurchaseReinforcementProps extends SystemSigner {
    game_id: num.BigNumberish;
    count: num.BigNumberish;
}

export interface ReinforceOutpostProps extends SystemSigner {
    game_id: num.BigNumberish;
    count: num.BigNumberish;
    outpost_id: num.BigNumberish;
}

export interface CreateEventProps extends SystemSigner {
    game_id: num.BigNumberish;
    
}

export interface ConfirmEventOutpost extends SystemSigner {
    game_id: num.BigNumberish;
    event_id: num.BigNumberish;
    outpost_id: num.BigNumberish;
}



// this is all to test

//for the trades only check the last one
export interface CreateTradeFor1Reinf extends SystemSigner {
    game_id: num.BigNumberish;
    count: num.BigNumberish;
    price: num.BigNumberish;
}

export interface RevokeTradeReinf extends SystemSigner {
    game_id: num.BigNumberish;
    trade_id: num.BigNumberish;
}

export interface PurchaseTradeReinf extends SystemSigner {
    game_id: num.BigNumberish;
    revenant_id: num.BigNumberish; 
    trade_id: num.BigNumberish;
}


// for the game not to implement yet
export interface ClaimScoreRewards extends SystemSigner {
    game_id: num.BigNumberish;
}

export interface ClaimEndGameRewards extends SystemSigner {
    game_id: num.BigNumberish;
}