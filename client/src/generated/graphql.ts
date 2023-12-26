import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import { print } from 'graphql'
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ContractAddress: { input: any; output: any; }
  Cursor: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  bool: { input: any; output: any; }
  felt252: { input: any; output: any; }
  u8: { input: any; output: any; }
  u32: { input: any; output: any; }
  u64: { input: any; output: any; }
  u128: { input: any; output: any; }
};

export type Game = {
  __typename?: 'Game';
  entity?: Maybe<World__Entity>;
  erc_addr?: Maybe<Scalars['ContractAddress']['output']>;
  event_interval?: Maybe<Scalars['u64']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  max_amount_of_revenants?: Maybe<Scalars['u32']['output']>;
  preparation_phase_interval?: Maybe<Scalars['u64']['output']>;
  prize?: Maybe<Scalars['u128']['output']>;
  revenant_init_price?: Maybe<Scalars['u128']['output']>;
  reward_pool_addr?: Maybe<Scalars['ContractAddress']['output']>;
  rewards_claim_status?: Maybe<Scalars['u32']['output']>;
  start_block_number?: Maybe<Scalars['u64']['output']>;
  status?: Maybe<Scalars['u32']['output']>;
};

export type GameConnection = {
  __typename?: 'GameConnection';
  edges?: Maybe<Array<Maybe<GameEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type GameEdge = {
  __typename?: 'GameEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Game>;
};

export type GameEntityCounter = {
  __typename?: 'GameEntityCounter';
  entity?: Maybe<World__Entity>;
  event_count?: Maybe<Scalars['u32']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  outpost_count?: Maybe<Scalars['u32']['output']>;
  outpost_exists_count?: Maybe<Scalars['u32']['output']>;
  reinforcement_count?: Maybe<Scalars['u32']['output']>;
  remain_life_count?: Maybe<Scalars['u32']['output']>;
  revenant_count?: Maybe<Scalars['u32']['output']>;
  score_count?: Maybe<Scalars['u32']['output']>;
  trade_count?: Maybe<Scalars['u32']['output']>;
};

export type GameEntityCounterConnection = {
  __typename?: 'GameEntityCounterConnection';
  edges?: Maybe<Array<Maybe<GameEntityCounterEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type GameEntityCounterEdge = {
  __typename?: 'GameEntityCounterEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<GameEntityCounter>;
};

export type GameEntityCounterOrder = {
  direction: OrderDirection;
  field: GameEntityCounterOrderField;
};

export enum GameEntityCounterOrderField {
  EventCount = 'EVENT_COUNT',
  GameId = 'GAME_ID',
  OutpostCount = 'OUTPOST_COUNT',
  OutpostExistsCount = 'OUTPOST_EXISTS_COUNT',
  ReinforcementCount = 'REINFORCEMENT_COUNT',
  RemainLifeCount = 'REMAIN_LIFE_COUNT',
  RevenantCount = 'REVENANT_COUNT',
  ScoreCount = 'SCORE_COUNT',
  TradeCount = 'TRADE_COUNT'
}

export type GameEntityCounterWhereInput = {
  event_count?: InputMaybe<Scalars['u32']['input']>;
  event_countEQ?: InputMaybe<Scalars['u32']['input']>;
  event_countGT?: InputMaybe<Scalars['u32']['input']>;
  event_countGTE?: InputMaybe<Scalars['u32']['input']>;
  event_countLT?: InputMaybe<Scalars['u32']['input']>;
  event_countLTE?: InputMaybe<Scalars['u32']['input']>;
  event_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_count?: InputMaybe<Scalars['u32']['input']>;
  outpost_countEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_countGT?: InputMaybe<Scalars['u32']['input']>;
  outpost_countGTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_countLT?: InputMaybe<Scalars['u32']['input']>;
  outpost_countLTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_count?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_countEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_countGT?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_countGTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_countLT?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_countLTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_count?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countEQ?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countGT?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countGTE?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countLT?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countLTE?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  remain_life_count?: InputMaybe<Scalars['u32']['input']>;
  remain_life_countEQ?: InputMaybe<Scalars['u32']['input']>;
  remain_life_countGT?: InputMaybe<Scalars['u32']['input']>;
  remain_life_countGTE?: InputMaybe<Scalars['u32']['input']>;
  remain_life_countLT?: InputMaybe<Scalars['u32']['input']>;
  remain_life_countLTE?: InputMaybe<Scalars['u32']['input']>;
  remain_life_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  revenant_count?: InputMaybe<Scalars['u32']['input']>;
  revenant_countEQ?: InputMaybe<Scalars['u32']['input']>;
  revenant_countGT?: InputMaybe<Scalars['u32']['input']>;
  revenant_countGTE?: InputMaybe<Scalars['u32']['input']>;
  revenant_countLT?: InputMaybe<Scalars['u32']['input']>;
  revenant_countLTE?: InputMaybe<Scalars['u32']['input']>;
  revenant_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  score_count?: InputMaybe<Scalars['u32']['input']>;
  score_countEQ?: InputMaybe<Scalars['u32']['input']>;
  score_countGT?: InputMaybe<Scalars['u32']['input']>;
  score_countGTE?: InputMaybe<Scalars['u32']['input']>;
  score_countLT?: InputMaybe<Scalars['u32']['input']>;
  score_countLTE?: InputMaybe<Scalars['u32']['input']>;
  score_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  trade_count?: InputMaybe<Scalars['u32']['input']>;
  trade_countEQ?: InputMaybe<Scalars['u32']['input']>;
  trade_countGT?: InputMaybe<Scalars['u32']['input']>;
  trade_countGTE?: InputMaybe<Scalars['u32']['input']>;
  trade_countLT?: InputMaybe<Scalars['u32']['input']>;
  trade_countLTE?: InputMaybe<Scalars['u32']['input']>;
  trade_countNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type GameOrder = {
  direction: OrderDirection;
  field: GameOrderField;
};

export enum GameOrderField {
  ErcAddr = 'ERC_ADDR',
  EventInterval = 'EVENT_INTERVAL',
  GameId = 'GAME_ID',
  MaxAmountOfRevenants = 'MAX_AMOUNT_OF_REVENANTS',
  PreparationPhaseInterval = 'PREPARATION_PHASE_INTERVAL',
  Prize = 'PRIZE',
  RevenantInitPrice = 'REVENANT_INIT_PRICE',
  RewardsClaimStatus = 'REWARDS_CLAIM_STATUS',
  RewardPoolAddr = 'REWARD_POOL_ADDR',
  StartBlockNumber = 'START_BLOCK_NUMBER',
  Status = 'STATUS'
}

export type GameTracker = {
  __typename?: 'GameTracker';
  count?: Maybe<Scalars['u32']['output']>;
  entity?: Maybe<World__Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
};

export type GameTrackerConnection = {
  __typename?: 'GameTrackerConnection';
  edges?: Maybe<Array<Maybe<GameTrackerEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type GameTrackerEdge = {
  __typename?: 'GameTrackerEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<GameTracker>;
};

export type GameTrackerOrder = {
  direction: OrderDirection;
  field: GameTrackerOrderField;
};

export enum GameTrackerOrderField {
  Count = 'COUNT',
  EntityId = 'ENTITY_ID'
}

export type GameTrackerWhereInput = {
  count?: InputMaybe<Scalars['u32']['input']>;
  countEQ?: InputMaybe<Scalars['u32']['input']>;
  countGT?: InputMaybe<Scalars['u32']['input']>;
  countGTE?: InputMaybe<Scalars['u32']['input']>;
  countLT?: InputMaybe<Scalars['u32']['input']>;
  countLTE?: InputMaybe<Scalars['u32']['input']>;
  countNEQ?: InputMaybe<Scalars['u32']['input']>;
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
};

export type GameWhereInput = {
  erc_addr?: InputMaybe<Scalars['ContractAddress']['input']>;
  erc_addrEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  erc_addrGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  erc_addrGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  erc_addrLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  erc_addrLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  erc_addrNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  event_interval?: InputMaybe<Scalars['u64']['input']>;
  event_intervalEQ?: InputMaybe<Scalars['u64']['input']>;
  event_intervalGT?: InputMaybe<Scalars['u64']['input']>;
  event_intervalGTE?: InputMaybe<Scalars['u64']['input']>;
  event_intervalLT?: InputMaybe<Scalars['u64']['input']>;
  event_intervalLTE?: InputMaybe<Scalars['u64']['input']>;
  event_intervalNEQ?: InputMaybe<Scalars['u64']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  max_amount_of_revenants?: InputMaybe<Scalars['u32']['input']>;
  max_amount_of_revenantsEQ?: InputMaybe<Scalars['u32']['input']>;
  max_amount_of_revenantsGT?: InputMaybe<Scalars['u32']['input']>;
  max_amount_of_revenantsGTE?: InputMaybe<Scalars['u32']['input']>;
  max_amount_of_revenantsLT?: InputMaybe<Scalars['u32']['input']>;
  max_amount_of_revenantsLTE?: InputMaybe<Scalars['u32']['input']>;
  max_amount_of_revenantsNEQ?: InputMaybe<Scalars['u32']['input']>;
  preparation_phase_interval?: InputMaybe<Scalars['u64']['input']>;
  preparation_phase_intervalEQ?: InputMaybe<Scalars['u64']['input']>;
  preparation_phase_intervalGT?: InputMaybe<Scalars['u64']['input']>;
  preparation_phase_intervalGTE?: InputMaybe<Scalars['u64']['input']>;
  preparation_phase_intervalLT?: InputMaybe<Scalars['u64']['input']>;
  preparation_phase_intervalLTE?: InputMaybe<Scalars['u64']['input']>;
  preparation_phase_intervalNEQ?: InputMaybe<Scalars['u64']['input']>;
  prize?: InputMaybe<Scalars['u128']['input']>;
  prizeEQ?: InputMaybe<Scalars['u128']['input']>;
  prizeGT?: InputMaybe<Scalars['u128']['input']>;
  prizeGTE?: InputMaybe<Scalars['u128']['input']>;
  prizeLT?: InputMaybe<Scalars['u128']['input']>;
  prizeLTE?: InputMaybe<Scalars['u128']['input']>;
  prizeNEQ?: InputMaybe<Scalars['u128']['input']>;
  revenant_init_price?: InputMaybe<Scalars['u128']['input']>;
  revenant_init_priceEQ?: InputMaybe<Scalars['u128']['input']>;
  revenant_init_priceGT?: InputMaybe<Scalars['u128']['input']>;
  revenant_init_priceGTE?: InputMaybe<Scalars['u128']['input']>;
  revenant_init_priceLT?: InputMaybe<Scalars['u128']['input']>;
  revenant_init_priceLTE?: InputMaybe<Scalars['u128']['input']>;
  revenant_init_priceNEQ?: InputMaybe<Scalars['u128']['input']>;
  reward_pool_addr?: InputMaybe<Scalars['ContractAddress']['input']>;
  reward_pool_addrEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  reward_pool_addrGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  reward_pool_addrGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  reward_pool_addrLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  reward_pool_addrLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  reward_pool_addrNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  rewards_claim_status?: InputMaybe<Scalars['u32']['input']>;
  rewards_claim_statusEQ?: InputMaybe<Scalars['u32']['input']>;
  rewards_claim_statusGT?: InputMaybe<Scalars['u32']['input']>;
  rewards_claim_statusGTE?: InputMaybe<Scalars['u32']['input']>;
  rewards_claim_statusLT?: InputMaybe<Scalars['u32']['input']>;
  rewards_claim_statusLTE?: InputMaybe<Scalars['u32']['input']>;
  rewards_claim_statusNEQ?: InputMaybe<Scalars['u32']['input']>;
  start_block_number?: InputMaybe<Scalars['u64']['input']>;
  start_block_numberEQ?: InputMaybe<Scalars['u64']['input']>;
  start_block_numberGT?: InputMaybe<Scalars['u64']['input']>;
  start_block_numberGTE?: InputMaybe<Scalars['u64']['input']>;
  start_block_numberLT?: InputMaybe<Scalars['u64']['input']>;
  start_block_numberLTE?: InputMaybe<Scalars['u64']['input']>;
  start_block_numberNEQ?: InputMaybe<Scalars['u64']['input']>;
  status?: InputMaybe<Scalars['u32']['input']>;
  statusEQ?: InputMaybe<Scalars['u32']['input']>;
  statusGT?: InputMaybe<Scalars['u32']['input']>;
  statusGTE?: InputMaybe<Scalars['u32']['input']>;
  statusLT?: InputMaybe<Scalars['u32']['input']>;
  statusLTE?: InputMaybe<Scalars['u32']['input']>;
  statusNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type ModelUnion = Game | GameEntityCounter | GameTracker | Outpost | OutpostPosition | PlayerInfo | ReinforcementBalance | Revenant | Trade | WorldEvent | WorldEventTracker;

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Outpost = {
  __typename?: 'Outpost';
  entity?: Maybe<World__Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  last_affect_event_id?: Maybe<Scalars['u128']['output']>;
  lifes?: Maybe<Scalars['u32']['output']>;
  name_outpost?: Maybe<Scalars['felt252']['output']>;
  owner?: Maybe<Scalars['ContractAddress']['output']>;
  reinforcement_count?: Maybe<Scalars['u32']['output']>;
  shield?: Maybe<Scalars['u8']['output']>;
  status?: Maybe<Scalars['u32']['output']>;
  x?: Maybe<Scalars['u32']['output']>;
  y?: Maybe<Scalars['u32']['output']>;
};

export type OutpostConnection = {
  __typename?: 'OutpostConnection';
  edges?: Maybe<Array<Maybe<OutpostEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type OutpostEdge = {
  __typename?: 'OutpostEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Outpost>;
};

export type OutpostOrder = {
  direction: OrderDirection;
  field: OutpostOrderField;
};

export enum OutpostOrderField {
  EntityId = 'ENTITY_ID',
  GameId = 'GAME_ID',
  LastAffectEventId = 'LAST_AFFECT_EVENT_ID',
  Lifes = 'LIFES',
  NameOutpost = 'NAME_OUTPOST',
  Owner = 'OWNER',
  ReinforcementCount = 'REINFORCEMENT_COUNT',
  Shield = 'SHIELD',
  Status = 'STATUS',
  X = 'X',
  Y = 'Y'
}

export type OutpostPosition = {
  __typename?: 'OutpostPosition';
  entity?: Maybe<World__Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  x?: Maybe<Scalars['u32']['output']>;
  y?: Maybe<Scalars['u32']['output']>;
};

export type OutpostPositionConnection = {
  __typename?: 'OutpostPositionConnection';
  edges?: Maybe<Array<Maybe<OutpostPositionEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type OutpostPositionEdge = {
  __typename?: 'OutpostPositionEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<OutpostPosition>;
};

export type OutpostPositionOrder = {
  direction: OrderDirection;
  field: OutpostPositionOrderField;
};

export enum OutpostPositionOrderField {
  EntityId = 'ENTITY_ID',
  GameId = 'GAME_ID',
  X = 'X',
  Y = 'Y'
}

export type OutpostPositionWhereInput = {
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  x?: InputMaybe<Scalars['u32']['input']>;
  xEQ?: InputMaybe<Scalars['u32']['input']>;
  xGT?: InputMaybe<Scalars['u32']['input']>;
  xGTE?: InputMaybe<Scalars['u32']['input']>;
  xLT?: InputMaybe<Scalars['u32']['input']>;
  xLTE?: InputMaybe<Scalars['u32']['input']>;
  xNEQ?: InputMaybe<Scalars['u32']['input']>;
  y?: InputMaybe<Scalars['u32']['input']>;
  yEQ?: InputMaybe<Scalars['u32']['input']>;
  yGT?: InputMaybe<Scalars['u32']['input']>;
  yGTE?: InputMaybe<Scalars['u32']['input']>;
  yLT?: InputMaybe<Scalars['u32']['input']>;
  yLTE?: InputMaybe<Scalars['u32']['input']>;
  yNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type OutpostWhereInput = {
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  last_affect_event_id?: InputMaybe<Scalars['u128']['input']>;
  last_affect_event_idEQ?: InputMaybe<Scalars['u128']['input']>;
  last_affect_event_idGT?: InputMaybe<Scalars['u128']['input']>;
  last_affect_event_idGTE?: InputMaybe<Scalars['u128']['input']>;
  last_affect_event_idLT?: InputMaybe<Scalars['u128']['input']>;
  last_affect_event_idLTE?: InputMaybe<Scalars['u128']['input']>;
  last_affect_event_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  lifes?: InputMaybe<Scalars['u32']['input']>;
  lifesEQ?: InputMaybe<Scalars['u32']['input']>;
  lifesGT?: InputMaybe<Scalars['u32']['input']>;
  lifesGTE?: InputMaybe<Scalars['u32']['input']>;
  lifesLT?: InputMaybe<Scalars['u32']['input']>;
  lifesLTE?: InputMaybe<Scalars['u32']['input']>;
  lifesNEQ?: InputMaybe<Scalars['u32']['input']>;
  name_outpost?: InputMaybe<Scalars['felt252']['input']>;
  name_outpostEQ?: InputMaybe<Scalars['felt252']['input']>;
  name_outpostGT?: InputMaybe<Scalars['felt252']['input']>;
  name_outpostGTE?: InputMaybe<Scalars['felt252']['input']>;
  name_outpostLT?: InputMaybe<Scalars['felt252']['input']>;
  name_outpostLTE?: InputMaybe<Scalars['felt252']['input']>;
  name_outpostNEQ?: InputMaybe<Scalars['felt252']['input']>;
  owner?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  reinforcement_count?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countEQ?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countGT?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countGTE?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countLT?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countLTE?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  shield?: InputMaybe<Scalars['u8']['input']>;
  shieldEQ?: InputMaybe<Scalars['u8']['input']>;
  shieldGT?: InputMaybe<Scalars['u8']['input']>;
  shieldGTE?: InputMaybe<Scalars['u8']['input']>;
  shieldLT?: InputMaybe<Scalars['u8']['input']>;
  shieldLTE?: InputMaybe<Scalars['u8']['input']>;
  shieldNEQ?: InputMaybe<Scalars['u8']['input']>;
  status?: InputMaybe<Scalars['u32']['input']>;
  statusEQ?: InputMaybe<Scalars['u32']['input']>;
  statusGT?: InputMaybe<Scalars['u32']['input']>;
  statusGTE?: InputMaybe<Scalars['u32']['input']>;
  statusLT?: InputMaybe<Scalars['u32']['input']>;
  statusLTE?: InputMaybe<Scalars['u32']['input']>;
  statusNEQ?: InputMaybe<Scalars['u32']['input']>;
  x?: InputMaybe<Scalars['u32']['input']>;
  xEQ?: InputMaybe<Scalars['u32']['input']>;
  xGT?: InputMaybe<Scalars['u32']['input']>;
  xGTE?: InputMaybe<Scalars['u32']['input']>;
  xLT?: InputMaybe<Scalars['u32']['input']>;
  xLTE?: InputMaybe<Scalars['u32']['input']>;
  xNEQ?: InputMaybe<Scalars['u32']['input']>;
  y?: InputMaybe<Scalars['u32']['input']>;
  yEQ?: InputMaybe<Scalars['u32']['input']>;
  yGT?: InputMaybe<Scalars['u32']['input']>;
  yGTE?: InputMaybe<Scalars['u32']['input']>;
  yLT?: InputMaybe<Scalars['u32']['input']>;
  yLTE?: InputMaybe<Scalars['u32']['input']>;
  yNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type PlayerInfo = {
  __typename?: 'PlayerInfo';
  earned_prize?: Maybe<Scalars['u128']['output']>;
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']['output']>;
  inited?: Maybe<Scalars['bool']['output']>;
  outpost_count?: Maybe<Scalars['u32']['output']>;
  owner?: Maybe<Scalars['ContractAddress']['output']>;
  reinforcement_count?: Maybe<Scalars['u32']['output']>;
  revenant_count?: Maybe<Scalars['u32']['output']>;
  score?: Maybe<Scalars['u32']['output']>;
  score_claim_status?: Maybe<Scalars['bool']['output']>;
};

export type PlayerInfoConnection = {
  __typename?: 'PlayerInfoConnection';
  edges?: Maybe<Array<Maybe<PlayerInfoEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type PlayerInfoEdge = {
  __typename?: 'PlayerInfoEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<PlayerInfo>;
};

export type PlayerInfoOrder = {
  direction: OrderDirection;
  field: PlayerInfoOrderField;
};

export enum PlayerInfoOrderField {
  EarnedPrize = 'EARNED_PRIZE',
  GameId = 'GAME_ID',
  Inited = 'INITED',
  OutpostCount = 'OUTPOST_COUNT',
  Owner = 'OWNER',
  ReinforcementCount = 'REINFORCEMENT_COUNT',
  RevenantCount = 'REVENANT_COUNT',
  Score = 'SCORE',
  ScoreClaimStatus = 'SCORE_CLAIM_STATUS'
}

export type PlayerInfoWhereInput = {
  earned_prize?: InputMaybe<Scalars['u128']['input']>;
  earned_prizeEQ?: InputMaybe<Scalars['u128']['input']>;
  earned_prizeGT?: InputMaybe<Scalars['u128']['input']>;
  earned_prizeGTE?: InputMaybe<Scalars['u128']['input']>;
  earned_prizeLT?: InputMaybe<Scalars['u128']['input']>;
  earned_prizeLTE?: InputMaybe<Scalars['u128']['input']>;
  earned_prizeNEQ?: InputMaybe<Scalars['u128']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  inited?: InputMaybe<Scalars['bool']['input']>;
  outpost_count?: InputMaybe<Scalars['u32']['input']>;
  outpost_countEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_countGT?: InputMaybe<Scalars['u32']['input']>;
  outpost_countGTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_countLT?: InputMaybe<Scalars['u32']['input']>;
  outpost_countLTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  owner?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  reinforcement_count?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countEQ?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countGT?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countGTE?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countLT?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countLTE?: InputMaybe<Scalars['u32']['input']>;
  reinforcement_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  revenant_count?: InputMaybe<Scalars['u32']['input']>;
  revenant_countEQ?: InputMaybe<Scalars['u32']['input']>;
  revenant_countGT?: InputMaybe<Scalars['u32']['input']>;
  revenant_countGTE?: InputMaybe<Scalars['u32']['input']>;
  revenant_countLT?: InputMaybe<Scalars['u32']['input']>;
  revenant_countLTE?: InputMaybe<Scalars['u32']['input']>;
  revenant_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  score?: InputMaybe<Scalars['u32']['input']>;
  scoreEQ?: InputMaybe<Scalars['u32']['input']>;
  scoreGT?: InputMaybe<Scalars['u32']['input']>;
  scoreGTE?: InputMaybe<Scalars['u32']['input']>;
  scoreLT?: InputMaybe<Scalars['u32']['input']>;
  scoreLTE?: InputMaybe<Scalars['u32']['input']>;
  scoreNEQ?: InputMaybe<Scalars['u32']['input']>;
  score_claim_status?: InputMaybe<Scalars['bool']['input']>;
};

export type ReinforcementBalance = {
  __typename?: 'ReinforcementBalance';
  count?: Maybe<Scalars['u32']['output']>;
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']['output']>;
  start_timestamp?: Maybe<Scalars['u64']['output']>;
  target_price?: Maybe<Scalars['u128']['output']>;
};

export type ReinforcementBalanceConnection = {
  __typename?: 'ReinforcementBalanceConnection';
  edges?: Maybe<Array<Maybe<ReinforcementBalanceEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type ReinforcementBalanceEdge = {
  __typename?: 'ReinforcementBalanceEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<ReinforcementBalance>;
};

export type ReinforcementBalanceOrder = {
  direction: OrderDirection;
  field: ReinforcementBalanceOrderField;
};

export enum ReinforcementBalanceOrderField {
  Count = 'COUNT',
  GameId = 'GAME_ID',
  StartTimestamp = 'START_TIMESTAMP',
  TargetPrice = 'TARGET_PRICE'
}

export type ReinforcementBalanceWhereInput = {
  count?: InputMaybe<Scalars['u32']['input']>;
  countEQ?: InputMaybe<Scalars['u32']['input']>;
  countGT?: InputMaybe<Scalars['u32']['input']>;
  countGTE?: InputMaybe<Scalars['u32']['input']>;
  countLT?: InputMaybe<Scalars['u32']['input']>;
  countLTE?: InputMaybe<Scalars['u32']['input']>;
  countNEQ?: InputMaybe<Scalars['u32']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  start_timestamp?: InputMaybe<Scalars['u64']['input']>;
  start_timestampEQ?: InputMaybe<Scalars['u64']['input']>;
  start_timestampGT?: InputMaybe<Scalars['u64']['input']>;
  start_timestampGTE?: InputMaybe<Scalars['u64']['input']>;
  start_timestampLT?: InputMaybe<Scalars['u64']['input']>;
  start_timestampLTE?: InputMaybe<Scalars['u64']['input']>;
  start_timestampNEQ?: InputMaybe<Scalars['u64']['input']>;
  target_price?: InputMaybe<Scalars['u128']['input']>;
  target_priceEQ?: InputMaybe<Scalars['u128']['input']>;
  target_priceGT?: InputMaybe<Scalars['u128']['input']>;
  target_priceGTE?: InputMaybe<Scalars['u128']['input']>;
  target_priceLT?: InputMaybe<Scalars['u128']['input']>;
  target_priceLTE?: InputMaybe<Scalars['u128']['input']>;
  target_priceNEQ?: InputMaybe<Scalars['u128']['input']>;
};

export type Revenant = {
  __typename?: 'Revenant';
  entity?: Maybe<World__Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
  first_name_idx?: Maybe<Scalars['u32']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  last_name_idx?: Maybe<Scalars['u32']['output']>;
  outpost_count?: Maybe<Scalars['u32']['output']>;
  owner?: Maybe<Scalars['ContractAddress']['output']>;
  status?: Maybe<Scalars['u32']['output']>;
};

export type RevenantConnection = {
  __typename?: 'RevenantConnection';
  edges?: Maybe<Array<Maybe<RevenantEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type RevenantEdge = {
  __typename?: 'RevenantEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Revenant>;
};

export type RevenantOrder = {
  direction: OrderDirection;
  field: RevenantOrderField;
};

export enum RevenantOrderField {
  EntityId = 'ENTITY_ID',
  FirstNameIdx = 'FIRST_NAME_IDX',
  GameId = 'GAME_ID',
  LastNameIdx = 'LAST_NAME_IDX',
  OutpostCount = 'OUTPOST_COUNT',
  Owner = 'OWNER',
  Status = 'STATUS'
}

export type RevenantWhereInput = {
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  first_name_idx?: InputMaybe<Scalars['u32']['input']>;
  first_name_idxEQ?: InputMaybe<Scalars['u32']['input']>;
  first_name_idxGT?: InputMaybe<Scalars['u32']['input']>;
  first_name_idxGTE?: InputMaybe<Scalars['u32']['input']>;
  first_name_idxLT?: InputMaybe<Scalars['u32']['input']>;
  first_name_idxLTE?: InputMaybe<Scalars['u32']['input']>;
  first_name_idxNEQ?: InputMaybe<Scalars['u32']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  last_name_idx?: InputMaybe<Scalars['u32']['input']>;
  last_name_idxEQ?: InputMaybe<Scalars['u32']['input']>;
  last_name_idxGT?: InputMaybe<Scalars['u32']['input']>;
  last_name_idxGTE?: InputMaybe<Scalars['u32']['input']>;
  last_name_idxLT?: InputMaybe<Scalars['u32']['input']>;
  last_name_idxLTE?: InputMaybe<Scalars['u32']['input']>;
  last_name_idxNEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_count?: InputMaybe<Scalars['u32']['input']>;
  outpost_countEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_countGT?: InputMaybe<Scalars['u32']['input']>;
  outpost_countGTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_countLT?: InputMaybe<Scalars['u32']['input']>;
  outpost_countLTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  owner?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  status?: InputMaybe<Scalars['u32']['input']>;
  statusEQ?: InputMaybe<Scalars['u32']['input']>;
  statusGT?: InputMaybe<Scalars['u32']['input']>;
  statusGTE?: InputMaybe<Scalars['u32']['input']>;
  statusLT?: InputMaybe<Scalars['u32']['input']>;
  statusLTE?: InputMaybe<Scalars['u32']['input']>;
  statusNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type Trade = {
  __typename?: 'Trade';
  buyer?: Maybe<Scalars['ContractAddress']['output']>;
  count?: Maybe<Scalars['u32']['output']>;
  entity?: Maybe<World__Entity>;
  entity_id?: Maybe<Scalars['u32']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  price?: Maybe<Scalars['u128']['output']>;
  seller?: Maybe<Scalars['ContractAddress']['output']>;
  status?: Maybe<Scalars['u32']['output']>;
};

export type TradeConnection = {
  __typename?: 'TradeConnection';
  edges?: Maybe<Array<Maybe<TradeEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type TradeEdge = {
  __typename?: 'TradeEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Trade>;
};

export type TradeOrder = {
  direction: OrderDirection;
  field: TradeOrderField;
};

export enum TradeOrderField {
  Buyer = 'BUYER',
  Count = 'COUNT',
  EntityId = 'ENTITY_ID',
  GameId = 'GAME_ID',
  Price = 'PRICE',
  Seller = 'SELLER',
  Status = 'STATUS'
}

export type TradeWhereInput = {
  buyer?: InputMaybe<Scalars['ContractAddress']['input']>;
  buyerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  buyerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  buyerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  buyerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  buyerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  buyerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  count?: InputMaybe<Scalars['u32']['input']>;
  countEQ?: InputMaybe<Scalars['u32']['input']>;
  countGT?: InputMaybe<Scalars['u32']['input']>;
  countGTE?: InputMaybe<Scalars['u32']['input']>;
  countLT?: InputMaybe<Scalars['u32']['input']>;
  countLTE?: InputMaybe<Scalars['u32']['input']>;
  countNEQ?: InputMaybe<Scalars['u32']['input']>;
  entity_id?: InputMaybe<Scalars['u32']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u32']['input']>;
  entity_idGT?: InputMaybe<Scalars['u32']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u32']['input']>;
  entity_idLT?: InputMaybe<Scalars['u32']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u32']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  price?: InputMaybe<Scalars['u128']['input']>;
  priceEQ?: InputMaybe<Scalars['u128']['input']>;
  priceGT?: InputMaybe<Scalars['u128']['input']>;
  priceGTE?: InputMaybe<Scalars['u128']['input']>;
  priceLT?: InputMaybe<Scalars['u128']['input']>;
  priceLTE?: InputMaybe<Scalars['u128']['input']>;
  priceNEQ?: InputMaybe<Scalars['u128']['input']>;
  seller?: InputMaybe<Scalars['ContractAddress']['input']>;
  sellerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  sellerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  sellerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  sellerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  sellerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  sellerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  status?: InputMaybe<Scalars['u32']['input']>;
  statusEQ?: InputMaybe<Scalars['u32']['input']>;
  statusGT?: InputMaybe<Scalars['u32']['input']>;
  statusGTE?: InputMaybe<Scalars['u32']['input']>;
  statusLT?: InputMaybe<Scalars['u32']['input']>;
  statusLTE?: InputMaybe<Scalars['u32']['input']>;
  statusNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type WorldEvent = {
  __typename?: 'WorldEvent';
  block_number?: Maybe<Scalars['u64']['output']>;
  destroy_count?: Maybe<Scalars['u32']['output']>;
  entity?: Maybe<World__Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  radius?: Maybe<Scalars['u32']['output']>;
  x?: Maybe<Scalars['u32']['output']>;
  y?: Maybe<Scalars['u32']['output']>;
};

export type WorldEventConnection = {
  __typename?: 'WorldEventConnection';
  edges?: Maybe<Array<Maybe<WorldEventEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type WorldEventEdge = {
  __typename?: 'WorldEventEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<WorldEvent>;
};

export type WorldEventOrder = {
  direction: OrderDirection;
  field: WorldEventOrderField;
};

export enum WorldEventOrderField {
  BlockNumber = 'BLOCK_NUMBER',
  DestroyCount = 'DESTROY_COUNT',
  EntityId = 'ENTITY_ID',
  GameId = 'GAME_ID',
  Radius = 'RADIUS',
  X = 'X',
  Y = 'Y'
}

export type WorldEventTracker = {
  __typename?: 'WorldEventTracker';
  entity?: Maybe<World__Entity>;
  event_id?: Maybe<Scalars['u128']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  outpost_id?: Maybe<Scalars['u128']['output']>;
};

export type WorldEventTrackerConnection = {
  __typename?: 'WorldEventTrackerConnection';
  edges?: Maybe<Array<Maybe<WorldEventTrackerEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type WorldEventTrackerEdge = {
  __typename?: 'WorldEventTrackerEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<WorldEventTracker>;
};

export type WorldEventTrackerOrder = {
  direction: OrderDirection;
  field: WorldEventTrackerOrderField;
};

export enum WorldEventTrackerOrderField {
  EventId = 'EVENT_ID',
  GameId = 'GAME_ID',
  OutpostId = 'OUTPOST_ID'
}

export type WorldEventTrackerWhereInput = {
  event_id?: InputMaybe<Scalars['u128']['input']>;
  event_idEQ?: InputMaybe<Scalars['u128']['input']>;
  event_idGT?: InputMaybe<Scalars['u128']['input']>;
  event_idGTE?: InputMaybe<Scalars['u128']['input']>;
  event_idLT?: InputMaybe<Scalars['u128']['input']>;
  event_idLTE?: InputMaybe<Scalars['u128']['input']>;
  event_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_id?: InputMaybe<Scalars['u128']['input']>;
  outpost_idEQ?: InputMaybe<Scalars['u128']['input']>;
  outpost_idGT?: InputMaybe<Scalars['u128']['input']>;
  outpost_idGTE?: InputMaybe<Scalars['u128']['input']>;
  outpost_idLT?: InputMaybe<Scalars['u128']['input']>;
  outpost_idLTE?: InputMaybe<Scalars['u128']['input']>;
  outpost_idNEQ?: InputMaybe<Scalars['u128']['input']>;
};

export type WorldEventWhereInput = {
  block_number?: InputMaybe<Scalars['u64']['input']>;
  block_numberEQ?: InputMaybe<Scalars['u64']['input']>;
  block_numberGT?: InputMaybe<Scalars['u64']['input']>;
  block_numberGTE?: InputMaybe<Scalars['u64']['input']>;
  block_numberLT?: InputMaybe<Scalars['u64']['input']>;
  block_numberLTE?: InputMaybe<Scalars['u64']['input']>;
  block_numberNEQ?: InputMaybe<Scalars['u64']['input']>;
  destroy_count?: InputMaybe<Scalars['u32']['input']>;
  destroy_countEQ?: InputMaybe<Scalars['u32']['input']>;
  destroy_countGT?: InputMaybe<Scalars['u32']['input']>;
  destroy_countGTE?: InputMaybe<Scalars['u32']['input']>;
  destroy_countLT?: InputMaybe<Scalars['u32']['input']>;
  destroy_countLTE?: InputMaybe<Scalars['u32']['input']>;
  destroy_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  radius?: InputMaybe<Scalars['u32']['input']>;
  radiusEQ?: InputMaybe<Scalars['u32']['input']>;
  radiusGT?: InputMaybe<Scalars['u32']['input']>;
  radiusGTE?: InputMaybe<Scalars['u32']['input']>;
  radiusLT?: InputMaybe<Scalars['u32']['input']>;
  radiusLTE?: InputMaybe<Scalars['u32']['input']>;
  radiusNEQ?: InputMaybe<Scalars['u32']['input']>;
  x?: InputMaybe<Scalars['u32']['input']>;
  xEQ?: InputMaybe<Scalars['u32']['input']>;
  xGT?: InputMaybe<Scalars['u32']['input']>;
  xGTE?: InputMaybe<Scalars['u32']['input']>;
  xLT?: InputMaybe<Scalars['u32']['input']>;
  xLTE?: InputMaybe<Scalars['u32']['input']>;
  xNEQ?: InputMaybe<Scalars['u32']['input']>;
  y?: InputMaybe<Scalars['u32']['input']>;
  yEQ?: InputMaybe<Scalars['u32']['input']>;
  yGT?: InputMaybe<Scalars['u32']['input']>;
  yGTE?: InputMaybe<Scalars['u32']['input']>;
  yLT?: InputMaybe<Scalars['u32']['input']>;
  yLTE?: InputMaybe<Scalars['u32']['input']>;
  yNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type World__Content = {
  __typename?: 'World__Content';
  cover_uri?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon_uri?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  socials?: Maybe<Array<Maybe<World__Social>>>;
  website?: Maybe<Scalars['String']['output']>;
};

export type World__Entity = {
  __typename?: 'World__Entity';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  event_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  models?: Maybe<Array<Maybe<ModelUnion>>>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
};

export type World__EntityConnection = {
  __typename?: 'World__EntityConnection';
  edges?: Maybe<Array<Maybe<World__EntityEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type World__EntityEdge = {
  __typename?: 'World__EntityEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<World__Entity>;
};

export type World__Event = {
  __typename?: 'World__Event';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

export type World__EventConnection = {
  __typename?: 'World__EventConnection';
  edges?: Maybe<Array<Maybe<World__EventEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type World__EventEdge = {
  __typename?: 'World__EventEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<World__Event>;
};

export type World__Metadata = {
  __typename?: 'World__Metadata';
  content?: Maybe<World__Content>;
  cover_img?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  icon_img?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
  uri?: Maybe<Scalars['String']['output']>;
};

export type World__MetadataConnection = {
  __typename?: 'World__MetadataConnection';
  edges?: Maybe<Array<Maybe<World__MetadataEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type World__MetadataEdge = {
  __typename?: 'World__MetadataEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<World__Metadata>;
};

export type World__Model = {
  __typename?: 'World__Model';
  class_hash?: Maybe<Scalars['felt252']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  transaction_hash?: Maybe<Scalars['felt252']['output']>;
};

export type World__ModelConnection = {
  __typename?: 'World__ModelConnection';
  edges?: Maybe<Array<Maybe<World__ModelEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type World__ModelEdge = {
  __typename?: 'World__ModelEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<World__Model>;
};

export type World__PageInfo = {
  __typename?: 'World__PageInfo';
  end_cursor?: Maybe<Scalars['Cursor']['output']>;
  has_next_page?: Maybe<Scalars['Boolean']['output']>;
  has_previous_page?: Maybe<Scalars['Boolean']['output']>;
  start_cursor?: Maybe<Scalars['Cursor']['output']>;
};

export type World__Query = {
  __typename?: 'World__Query';
  entities?: Maybe<World__EntityConnection>;
  entity: World__Entity;
  events?: Maybe<World__EventConnection>;
  gameModels?: Maybe<GameConnection>;
  gameentitycounterModels?: Maybe<GameEntityCounterConnection>;
  gametrackerModels?: Maybe<GameTrackerConnection>;
  metadatas?: Maybe<World__MetadataConnection>;
  model: World__Model;
  models?: Maybe<World__ModelConnection>;
  outpostModels?: Maybe<OutpostConnection>;
  outpostpositionModels?: Maybe<OutpostPositionConnection>;
  playerinfoModels?: Maybe<PlayerInfoConnection>;
  reinforcementbalanceModels?: Maybe<ReinforcementBalanceConnection>;
  revenantModels?: Maybe<RevenantConnection>;
  tradeModels?: Maybe<TradeConnection>;
  transaction: World__Transaction;
  transactions?: Maybe<World__TransactionConnection>;
  worldeventModels?: Maybe<WorldEventConnection>;
  worldeventtrackerModels?: Maybe<WorldEventTrackerConnection>;
};


export type World__QueryEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type World__QueryEntityArgs = {
  id: Scalars['ID']['input'];
};


export type World__QueryEventsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type World__QueryGameModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<GameOrder>;
  where?: InputMaybe<GameWhereInput>;
};


export type World__QueryGameentitycounterModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<GameEntityCounterOrder>;
  where?: InputMaybe<GameEntityCounterWhereInput>;
};


export type World__QueryGametrackerModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<GameTrackerOrder>;
  where?: InputMaybe<GameTrackerWhereInput>;
};


export type World__QueryMetadatasArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type World__QueryModelArgs = {
  id: Scalars['ID']['input'];
};


export type World__QueryModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type World__QueryOutpostModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OutpostOrder>;
  where?: InputMaybe<OutpostWhereInput>;
};


export type World__QueryOutpostpositionModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OutpostPositionOrder>;
  where?: InputMaybe<OutpostPositionWhereInput>;
};


export type World__QueryPlayerinfoModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PlayerInfoOrder>;
  where?: InputMaybe<PlayerInfoWhereInput>;
};


export type World__QueryReinforcementbalanceModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<ReinforcementBalanceOrder>;
  where?: InputMaybe<ReinforcementBalanceWhereInput>;
};


export type World__QueryRevenantModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RevenantOrder>;
  where?: InputMaybe<RevenantWhereInput>;
};


export type World__QueryTradeModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<TradeOrder>;
  where?: InputMaybe<TradeWhereInput>;
};


export type World__QueryTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type World__QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type World__QueryWorldeventModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<WorldEventOrder>;
  where?: InputMaybe<WorldEventWhereInput>;
};


export type World__QueryWorldeventtrackerModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<WorldEventTrackerOrder>;
  where?: InputMaybe<WorldEventTrackerWhereInput>;
};

export type World__Social = {
  __typename?: 'World__Social';
  name?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type World__Subscription = {
  __typename?: 'World__Subscription';
  entityUpdated: World__Entity;
  eventEmitted: World__Event;
  modelRegistered: World__Model;
};


export type World__SubscriptionEntityUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type World__SubscriptionEventEmittedArgs = {
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type World__SubscriptionModelRegisteredArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type World__Transaction = {
  __typename?: 'World__Transaction';
  calldata?: Maybe<Array<Maybe<Scalars['felt252']['output']>>>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  max_fee?: Maybe<Scalars['felt252']['output']>;
  nonce?: Maybe<Scalars['felt252']['output']>;
  sender_address?: Maybe<Scalars['felt252']['output']>;
  signature?: Maybe<Array<Maybe<Scalars['felt252']['output']>>>;
  transaction_hash?: Maybe<Scalars['felt252']['output']>;
};

export type World__TransactionConnection = {
  __typename?: 'World__TransactionConnection';
  edges?: Maybe<Array<Maybe<World__TransactionEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type World__TransactionEdge = {
  __typename?: 'World__TransactionEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<World__Transaction>;
};

export type FetchSpecificOutRevQueryVariables = Exact<{
  game_id: Scalars['String']['input'];
  entity_id: Scalars['String']['input'];
}>;


export type FetchSpecificOutRevQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', edges?: Array<{ __typename?: 'World__EntityEdge', node?: { __typename?: 'World__Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game' } | { __typename: 'GameEntityCounter' } | { __typename: 'GameTracker' } | { __typename: 'Outpost', game_id?: any | null, entity_id?: any | null, owner?: any | null, name_outpost?: any | null, x?: any | null, y?: any | null, lifes?: any | null, shield?: any | null, reinforcement_count?: any | null, status?: any | null, last_affect_event_id?: any | null } | { __typename: 'OutpostPosition' } | { __typename: 'PlayerInfo' } | { __typename: 'ReinforcementBalance' } | { __typename: 'Revenant', game_id?: any | null, entity_id?: any | null, owner?: any | null, first_name_idx?: any | null, last_name_idx?: any | null, outpost_count?: any | null, status?: any | null } | { __typename: 'Trade' } | { __typename: 'WorldEvent' } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null> | null } | null };

export type GetAllOutRevQueryVariables = Exact<{
  game_id: Scalars['u32']['input'];
  outpostCount: Scalars['Int']['input'];
}>;


export type GetAllOutRevQuery = { __typename?: 'World__Query', outpostModels?: { __typename?: 'OutpostConnection', edges?: Array<{ __typename?: 'OutpostEdge', node?: { __typename?: 'Outpost', entity?: { __typename?: 'World__Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game' } | { __typename: 'GameEntityCounter' } | { __typename: 'GameTracker' } | { __typename: 'Outpost', game_id?: any | null, entity_id?: any | null, owner?: any | null, name_outpost?: any | null, x?: any | null, y?: any | null, lifes?: any | null, shield?: any | null, reinforcement_count?: any | null, status?: any | null, last_affect_event_id?: any | null } | { __typename: 'OutpostPosition' } | { __typename: 'PlayerInfo' } | { __typename: 'ReinforcementBalance' } | { __typename: 'Revenant', game_id?: any | null, entity_id?: any | null, owner?: any | null, first_name_idx?: any | null, last_name_idx?: any | null, outpost_count?: any | null, status?: any | null } | { __typename: 'Trade' } | { __typename: 'WorldEvent' } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null } | null> | null } | null };

export type GetAllOwnRevOutQueryVariables = Exact<{
  game_id: Scalars['u32']['input'];
  outpostCount: Scalars['Int']['input'];
  owner: Scalars['ContractAddress']['input'];
}>;


export type GetAllOwnRevOutQuery = { __typename?: 'World__Query', outpostModels?: { __typename?: 'OutpostConnection', edges?: Array<{ __typename?: 'OutpostEdge', node?: { __typename?: 'Outpost', entity?: { __typename?: 'World__Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game' } | { __typename: 'GameEntityCounter' } | { __typename: 'GameTracker' } | { __typename: 'Outpost', game_id?: any | null, entity_id?: any | null, owner?: any | null, name_outpost?: any | null, x?: any | null, y?: any | null, lifes?: any | null, shield?: any | null, reinforcement_count?: any | null, status?: any | null, last_affect_event_id?: any | null } | { __typename: 'OutpostPosition' } | { __typename: 'PlayerInfo' } | { __typename: 'ReinforcementBalance' } | { __typename: 'Revenant', game_id?: any | null, entity_id?: any | null, owner?: any | null, first_name_idx?: any | null, last_name_idx?: any | null, outpost_count?: any | null, status?: any | null } | { __typename: 'Trade' } | { __typename: 'WorldEvent' } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null } | null> | null } | null };

export type GetTradesAvailableQueryVariables = Exact<{
  game_id: Scalars['u32']['input'];
  tradeStatus: Scalars['u32']['input'];
}>;


export type GetTradesAvailableQuery = { __typename?: 'World__Query', tradeModels?: { __typename?: 'TradeConnection', edges?: Array<{ __typename?: 'TradeEdge', node?: { __typename?: 'Trade', entity?: { __typename?: 'World__Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game' } | { __typename: 'GameEntityCounter' } | { __typename: 'GameTracker' } | { __typename: 'Outpost' } | { __typename: 'OutpostPosition' } | { __typename: 'PlayerInfo' } | { __typename: 'ReinforcementBalance' } | { __typename: 'Revenant' } | { __typename: 'Trade', game_id?: any | null, entity_id?: any | null, seller?: any | null, price?: any | null, count?: any | null, buyer?: any | null, status?: any | null } | { __typename: 'WorldEvent' } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null } | null> | null } | null };

export type GetSortedPlayerReinforcementsQueryVariables = Exact<{
  game_id: Scalars['u32']['input'];
  playersNum: Scalars['Int']['input'];
}>;


export type GetSortedPlayerReinforcementsQuery = { __typename?: 'World__Query', playerinfoModels?: { __typename?: 'PlayerInfoConnection', edges?: Array<{ __typename?: 'PlayerInfoEdge', node?: { __typename?: 'PlayerInfo', entity?: { __typename?: 'World__Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game' } | { __typename: 'GameEntityCounter' } | { __typename: 'GameTracker' } | { __typename: 'Outpost' } | { __typename: 'OutpostPosition' } | { __typename: 'PlayerInfo', game_id?: any | null, owner?: any | null, score?: any | null, score_claim_status?: any | null, earned_prize?: any | null, revenant_count?: any | null, outpost_count?: any | null, reinforcement_count?: any | null, inited?: any | null } | { __typename: 'ReinforcementBalance' } | { __typename: 'Revenant' } | { __typename: 'Trade' } | { __typename: 'WorldEvent' } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null } | null> | null } | null };

export type FetchSpecificEventQueryVariables = Exact<{
  game_id: Scalars['String']['input'];
  entity_id: Scalars['String']['input'];
}>;


export type FetchSpecificEventQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', edges?: Array<{ __typename?: 'World__EntityEdge', node?: { __typename?: 'World__Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game' } | { __typename: 'GameEntityCounter' } | { __typename: 'GameTracker' } | { __typename: 'Outpost' } | { __typename: 'OutpostPosition' } | { __typename: 'PlayerInfo' } | { __typename: 'ReinforcementBalance' } | { __typename: 'Revenant' } | { __typename: 'Trade' } | { __typename: 'WorldEvent', game_id?: any | null, entity_id?: any | null, x?: any | null, y?: any | null, radius?: any | null, destroy_count?: any | null, block_number?: any | null } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null> | null } | null };

export type GetAllEventsQueryVariables = Exact<{
  game_id: Scalars['u32']['input'];
  eventsNumber: Scalars['Int']['input'];
}>;


export type GetAllEventsQuery = { __typename?: 'World__Query', worldeventModels?: { __typename?: 'WorldEventConnection', edges?: Array<{ __typename?: 'WorldEventEdge', node?: { __typename?: 'WorldEvent', entity?: { __typename?: 'World__Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game' } | { __typename: 'GameEntityCounter' } | { __typename: 'GameTracker' } | { __typename: 'Outpost' } | { __typename: 'OutpostPosition' } | { __typename: 'PlayerInfo' } | { __typename: 'ReinforcementBalance' } | { __typename: 'Revenant' } | { __typename: 'Trade' } | { __typename: 'WorldEvent', game_id?: any | null, entity_id?: any | null, x?: any | null, y?: any | null, radius?: any | null, destroy_count?: any | null, block_number?: any | null } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null } | null> | null } | null };

export type GetPlayerInfoQueryVariables = Exact<{
  game_id: Scalars['String']['input'];
  owner: Scalars['String']['input'];
}>;


export type GetPlayerInfoQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', edges?: Array<{ __typename?: 'World__EntityEdge', node?: { __typename?: 'World__Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game' } | { __typename: 'GameEntityCounter' } | { __typename: 'GameTracker' } | { __typename: 'Outpost' } | { __typename: 'OutpostPosition' } | { __typename: 'PlayerInfo', game_id?: any | null, owner?: any | null, score?: any | null, score_claim_status?: any | null, earned_prize?: any | null, revenant_count?: any | null, outpost_count?: any | null, reinforcement_count?: any | null, inited?: any | null } | { __typename: 'ReinforcementBalance' } | { __typename: 'Revenant' } | { __typename: 'Trade' } | { __typename: 'WorldEvent' } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null> | null } | null };

export type GetGameTrackerQueryVariables = Exact<{
  config: Scalars['String']['input'];
}>;


export type GetGameTrackerQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', edges?: Array<{ __typename?: 'World__EntityEdge', node?: { __typename?: 'World__Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game' } | { __typename: 'GameEntityCounter' } | { __typename: 'GameTracker', entity_id?: any | null, count?: any | null } | { __typename: 'Outpost' } | { __typename: 'OutpostPosition' } | { __typename: 'PlayerInfo' } | { __typename: 'ReinforcementBalance' } | { __typename: 'Revenant' } | { __typename: 'Trade' } | { __typename: 'WorldEvent' } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null> | null } | null };

export type GetGameDataQueryVariables = Exact<{
  game_id: Scalars['String']['input'];
}>;


export type GetGameDataQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', edges?: Array<{ __typename?: 'World__EntityEdge', node?: { __typename?: 'World__Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game', game_id?: any | null, start_block_number?: any | null, prize?: any | null, preparation_phase_interval?: any | null, event_interval?: any | null, erc_addr?: any | null, reward_pool_addr?: any | null, revenant_init_price?: any | null, rewards_claim_status?: any | null, status?: any | null, max_amount_of_revenants?: any | null } | { __typename: 'GameEntityCounter', game_id?: any | null, revenant_count?: any | null, outpost_count?: any | null, event_count?: any | null, outpost_exists_count?: any | null, remain_life_count?: any | null, reinforcement_count?: any | null, trade_count?: any | null, score_count?: any | null } | { __typename: 'GameTracker' } | { __typename: 'Outpost' } | { __typename: 'OutpostPosition' } | { __typename: 'PlayerInfo' } | { __typename: 'ReinforcementBalance' } | { __typename: 'Revenant' } | { __typename: 'Trade' } | { __typename: 'WorldEvent' } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null> | null } | null };


export const FetchSpecificOutRevDocument = gql`
    query fetchSpecificOutRev($game_id: String!, $entity_id: String!) {
  entities(keys: [$game_id, $entity_id]) {
    edges {
      node {
        keys
        models {
          __typename
          ... on Revenant {
            game_id
            entity_id
            owner
            first_name_idx
            last_name_idx
            outpost_count
            status
          }
          ... on Outpost {
            game_id
            entity_id
            owner
            name_outpost
            x
            y
            lifes
            shield
            reinforcement_count
            status
            last_affect_event_id
          }
        }
      }
    }
  }
}
    `;
export const GetAllOutRevDocument = gql`
    query getAllOutRev($game_id: u32!, $outpostCount: Int!) {
  outpostModels(first: $outpostCount, where: {game_id: $game_id}) {
    edges {
      node {
        entity {
          keys
          models {
            __typename
            ... on Outpost {
              game_id
              entity_id
              owner
              name_outpost
              x
              y
              lifes
              shield
              reinforcement_count
              status
              last_affect_event_id
            }
            ... on Revenant {
              game_id
              entity_id
              owner
              first_name_idx
              last_name_idx
              outpost_count
              status
            }
          }
        }
      }
    }
  }
}
    `;
export const GetAllOwnRevOutDocument = gql`
    query getAllOwnRevOut($game_id: u32!, $outpostCount: Int!, $owner: ContractAddress!) {
  outpostModels(first: $outpostCount, where: {game_id: $game_id, owner: $owner}) {
    edges {
      node {
        entity {
          keys
          models {
            __typename
            ... on Outpost {
              game_id
              entity_id
              owner
              name_outpost
              x
              y
              lifes
              shield
              reinforcement_count
              status
              last_affect_event_id
            }
            ... on Revenant {
              game_id
              entity_id
              owner
              first_name_idx
              last_name_idx
              outpost_count
              status
            }
          }
        }
      }
    }
  }
}
    `;
export const GetTradesAvailableDocument = gql`
    query getTradesAvailable($game_id: u32!, $tradeStatus: u32!) {
  tradeModels(where: {game_id: $game_id, status: $tradeStatus}) {
    edges {
      node {
        entity {
          keys
          models {
            __typename
            ... on Trade {
              game_id
              entity_id
              seller
              price
              count
              buyer
              status
            }
          }
        }
      }
    }
  }
}
    `;
export const GetSortedPlayerReinforcementsDocument = gql`
    query getSortedPlayerReinforcements($game_id: u32!, $playersNum: Int!) {
  playerinfoModels(
    where: {game_id: $game_id}
    first: $playersNum
    order: {direction: DESC, field: REINFORCEMENT_COUNT}
  ) {
    edges {
      node {
        entity {
          keys
          models {
            __typename
            ... on PlayerInfo {
              game_id
              owner
              score
              score_claim_status
              earned_prize
              revenant_count
              outpost_count
              reinforcement_count
              inited
            }
          }
        }
      }
    }
  }
}
    `;
export const FetchSpecificEventDocument = gql`
    query fetchSpecificEvent($game_id: String!, $entity_id: String!) {
  entities(keys: [$game_id, $entity_id]) {
    edges {
      node {
        keys
        models {
          __typename
          ... on WorldEvent {
            game_id
            entity_id
            x
            y
            radius
            destroy_count
            block_number
          }
        }
      }
    }
  }
}
    `;
export const GetAllEventsDocument = gql`
    query getAllEvents($game_id: u32!, $eventsNumber: Int!) {
  worldeventModels(first: $eventsNumber, where: {game_id: $game_id}) {
    edges {
      node {
        entity {
          keys
          models {
            __typename
            ... on WorldEvent {
              game_id
              entity_id
              x
              y
              radius
              destroy_count
              block_number
            }
          }
        }
      }
    }
  }
}
    `;
export const GetPlayerInfoDocument = gql`
    query getPlayerInfo($game_id: String!, $owner: String!) {
  entities(keys: [$game_id, $owner]) {
    edges {
      node {
        keys
        models {
          __typename
          ... on PlayerInfo {
            game_id
            owner
            score
            score_claim_status
            earned_prize
            revenant_count
            outpost_count
            reinforcement_count
            inited
          }
        }
      }
    }
  }
}
    `;
export const GetGameTrackerDocument = gql`
    query getGameTracker($config: String!) {
  entities(keys: [$config]) {
    edges {
      node {
        keys
        models {
          __typename
          ... on GameTracker {
            entity_id
            count
          }
        }
      }
    }
  }
}
    `;
export const GetGameDataDocument = gql`
    query getGameData($game_id: String!) {
  entities(keys: [$game_id]) {
    edges {
      node {
        keys
        models {
          __typename
          ... on Game {
            game_id
            start_block_number
            prize
            preparation_phase_interval
            event_interval
            erc_addr
            reward_pool_addr
            revenant_init_price
            rewards_claim_status
            status
            max_amount_of_revenants
          }
          ... on GameEntityCounter {
            game_id
            revenant_count
            outpost_count
            event_count
            outpost_exists_count
            remain_life_count
            reinforcement_count
            trade_count
            score_count
          }
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const FetchSpecificOutRevDocumentString = print(FetchSpecificOutRevDocument);
const GetAllOutRevDocumentString = print(GetAllOutRevDocument);
const GetAllOwnRevOutDocumentString = print(GetAllOwnRevOutDocument);
const GetTradesAvailableDocumentString = print(GetTradesAvailableDocument);
const GetSortedPlayerReinforcementsDocumentString = print(GetSortedPlayerReinforcementsDocument);
const FetchSpecificEventDocumentString = print(FetchSpecificEventDocument);
const GetAllEventsDocumentString = print(GetAllEventsDocument);
const GetPlayerInfoDocumentString = print(GetPlayerInfoDocument);
const GetGameTrackerDocumentString = print(GetGameTrackerDocument);
const GetGameDataDocumentString = print(GetGameDataDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    fetchSpecificOutRev(variables: FetchSpecificOutRevQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: FetchSpecificOutRevQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<FetchSpecificOutRevQuery>(FetchSpecificOutRevDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'fetchSpecificOutRev', 'query');
    },
    getAllOutRev(variables: GetAllOutRevQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetAllOutRevQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetAllOutRevQuery>(GetAllOutRevDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllOutRev', 'query');
    },
    getAllOwnRevOut(variables: GetAllOwnRevOutQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetAllOwnRevOutQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetAllOwnRevOutQuery>(GetAllOwnRevOutDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllOwnRevOut', 'query');
    },
    getTradesAvailable(variables: GetTradesAvailableQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetTradesAvailableQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetTradesAvailableQuery>(GetTradesAvailableDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTradesAvailable', 'query');
    },
    getSortedPlayerReinforcements(variables: GetSortedPlayerReinforcementsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetSortedPlayerReinforcementsQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetSortedPlayerReinforcementsQuery>(GetSortedPlayerReinforcementsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getSortedPlayerReinforcements', 'query');
    },
    fetchSpecificEvent(variables: FetchSpecificEventQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: FetchSpecificEventQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<FetchSpecificEventQuery>(FetchSpecificEventDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'fetchSpecificEvent', 'query');
    },
    getAllEvents(variables: GetAllEventsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetAllEventsQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetAllEventsQuery>(GetAllEventsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllEvents', 'query');
    },
    getPlayerInfo(variables: GetPlayerInfoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetPlayerInfoQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetPlayerInfoQuery>(GetPlayerInfoDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPlayerInfo', 'query');
    },
    getGameTracker(variables: GetGameTrackerQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetGameTrackerQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetGameTrackerQuery>(GetGameTrackerDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getGameTracker', 'query');
    },
    getGameData(variables: GetGameDataQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetGameDataQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetGameDataQuery>(GetGameDataDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getGameData', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;