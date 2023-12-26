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
  Enum: { input: any; output: any; }
  bool: { input: any; output: any; }
  felt252: { input: any; output: any; }
  u32: { input: any; output: any; }
  u128: { input: any; output: any; }
};

export type Familiar = {
  __typename?: 'Familiar';
  entity?: Maybe<World__Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
  familiar_type_id?: Maybe<Scalars['u128']['output']>;
  game_id?: Maybe<Scalars['u128']['output']>;
};

export type FamiliarConnection = {
  __typename?: 'FamiliarConnection';
  edges?: Maybe<Array<Maybe<FamiliarEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type FamiliarEdge = {
  __typename?: 'FamiliarEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Familiar>;
};

export type FamiliarOrder = {
  direction: OrderDirection;
  field: FamiliarOrderField;
};

export enum FamiliarOrderField {
  EntityId = 'ENTITY_ID',
  FamiliarTypeId = 'FAMILIAR_TYPE_ID',
  GameId = 'GAME_ID'
}

export type FamiliarWhereInput = {
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  familiar_type_id?: InputMaybe<Scalars['u128']['input']>;
  familiar_type_idEQ?: InputMaybe<Scalars['u128']['input']>;
  familiar_type_idGT?: InputMaybe<Scalars['u128']['input']>;
  familiar_type_idGTE?: InputMaybe<Scalars['u128']['input']>;
  familiar_type_idLT?: InputMaybe<Scalars['u128']['input']>;
  familiar_type_idLTE?: InputMaybe<Scalars['u128']['input']>;
  familiar_type_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  game_id?: InputMaybe<Scalars['u128']['input']>;
  game_idEQ?: InputMaybe<Scalars['u128']['input']>;
  game_idGT?: InputMaybe<Scalars['u128']['input']>;
  game_idGTE?: InputMaybe<Scalars['u128']['input']>;
  game_idLT?: InputMaybe<Scalars['u128']['input']>;
  game_idLTE?: InputMaybe<Scalars['u128']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u128']['input']>;
};

export type ModelUnion = Familiar | Occupied | Owner | ValueInGame;

export type Occupied = {
  __typename?: 'Occupied';
  doing?: Maybe<Scalars['Enum']['output']>;
  entity?: Maybe<World__Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
  reaped?: Maybe<Scalars['bool']['output']>;
  until?: Maybe<Scalars['u32']['output']>;
};

export type OccupiedConnection = {
  __typename?: 'OccupiedConnection';
  edges?: Maybe<Array<Maybe<OccupiedEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type OccupiedEdge = {
  __typename?: 'OccupiedEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Occupied>;
};

export type OccupiedOrder = {
  direction: OrderDirection;
  field: OccupiedOrderField;
};

export enum OccupiedOrderField {
  Doing = 'DOING',
  EntityId = 'ENTITY_ID',
  Reaped = 'REAPED',
  Until = 'UNTIL'
}

export type OccupiedWhereInput = {
  doing?: InputMaybe<Scalars['Enum']['input']>;
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  reaped?: InputMaybe<Scalars['bool']['input']>;
  until?: InputMaybe<Scalars['u32']['input']>;
  untilEQ?: InputMaybe<Scalars['u32']['input']>;
  untilGT?: InputMaybe<Scalars['u32']['input']>;
  untilGTE?: InputMaybe<Scalars['u32']['input']>;
  untilLT?: InputMaybe<Scalars['u32']['input']>;
  untilLTE?: InputMaybe<Scalars['u32']['input']>;
  untilNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Owner = {
  __typename?: 'Owner';
  address?: Maybe<Scalars['ContractAddress']['output']>;
  entity?: Maybe<World__Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
};

export type OwnerConnection = {
  __typename?: 'OwnerConnection';
  edges?: Maybe<Array<Maybe<OwnerEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type OwnerEdge = {
  __typename?: 'OwnerEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Owner>;
};

export type OwnerOrder = {
  direction: OrderDirection;
  field: OwnerOrderField;
};

export enum OwnerOrderField {
  Address = 'ADDRESS',
  EntityId = 'ENTITY_ID'
}

export type OwnerWhereInput = {
  address?: InputMaybe<Scalars['ContractAddress']['input']>;
  addressEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  addressGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  addressGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  addressLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  addressLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  addressNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
};

export type ValueInGame = {
  __typename?: 'ValueInGame';
  entity?: Maybe<World__Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
  game_id?: Maybe<Scalars['u128']['output']>;
  value?: Maybe<Scalars['u32']['output']>;
};

export type ValueInGameConnection = {
  __typename?: 'ValueInGameConnection';
  edges?: Maybe<Array<Maybe<ValueInGameEdge>>>;
  page_info: World__PageInfo;
  total_count: Scalars['Int']['output'];
};

export type ValueInGameEdge = {
  __typename?: 'ValueInGameEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<ValueInGame>;
};

export type ValueInGameOrder = {
  direction: OrderDirection;
  field: ValueInGameOrderField;
};

export enum ValueInGameOrderField {
  EntityId = 'ENTITY_ID',
  GameId = 'GAME_ID',
  Value = 'VALUE'
}

export type ValueInGameWhereInput = {
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  game_id?: InputMaybe<Scalars['u128']['input']>;
  game_idEQ?: InputMaybe<Scalars['u128']['input']>;
  game_idGT?: InputMaybe<Scalars['u128']['input']>;
  game_idGTE?: InputMaybe<Scalars['u128']['input']>;
  game_idLT?: InputMaybe<Scalars['u128']['input']>;
  game_idLTE?: InputMaybe<Scalars['u128']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  value?: InputMaybe<Scalars['u32']['input']>;
  valueEQ?: InputMaybe<Scalars['u32']['input']>;
  valueGT?: InputMaybe<Scalars['u32']['input']>;
  valueGTE?: InputMaybe<Scalars['u32']['input']>;
  valueLT?: InputMaybe<Scalars['u32']['input']>;
  valueLTE?: InputMaybe<Scalars['u32']['input']>;
  valueNEQ?: InputMaybe<Scalars['u32']['input']>;
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
  familiarModels?: Maybe<FamiliarConnection>;
  metadatas?: Maybe<World__MetadataConnection>;
  model: World__Model;
  models?: Maybe<World__ModelConnection>;
  occupiedModels?: Maybe<OccupiedConnection>;
  ownerModels?: Maybe<OwnerConnection>;
  transaction: World__Transaction;
  transactions?: Maybe<World__TransactionConnection>;
  valueingameModels?: Maybe<ValueInGameConnection>;
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


export type World__QueryFamiliarModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<FamiliarOrder>;
  where?: InputMaybe<FamiliarWhereInput>;
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


export type World__QueryOccupiedModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OccupiedOrder>;
  where?: InputMaybe<OccupiedWhereInput>;
};


export type World__QueryOwnerModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OwnerOrder>;
  where?: InputMaybe<OwnerWhereInput>;
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


export type World__QueryValueingameModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<ValueInGameOrder>;
  where?: InputMaybe<ValueInGameWhereInput>;
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

export type GetGameValuesQueryVariables = Exact<{
  game_id: Scalars['u128']['input'];
}>;


export type GetGameValuesQuery = { __typename?: 'World__Query', valueingameModels?: { __typename?: 'ValueInGameConnection', edges?: Array<{ __typename?: 'ValueInGameEdge', node?: { __typename?: 'ValueInGame', entity?: { __typename?: 'World__Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Familiar' } | { __typename: 'Occupied' } | { __typename: 'Owner' } | { __typename: 'ValueInGame', entity_id?: any | null, value?: any | null } | null> | null } | null } | null } | null> | null } | null };

export type GetPlayersGamesQueryVariables = Exact<{
  address: Scalars['ContractAddress']['input'];
}>;


export type GetPlayersGamesQuery = { __typename?: 'World__Query', ownerModels?: { __typename?: 'OwnerConnection', edges?: Array<{ __typename?: 'OwnerEdge', node?: { __typename?: 'Owner', entity?: { __typename?: 'World__Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Familiar' } | { __typename: 'Occupied' } | { __typename: 'Owner', entity_id?: any | null, address?: any | null } | { __typename: 'ValueInGame' } | null> | null } | null } | null } | null> | null } | null };


export const GetGameValuesDocument = gql`
    query getGameValues($game_id: u128!) {
  valueingameModels(where: {game_id: $game_id}) {
    edges {
      node {
        entity {
          keys
          models {
            __typename
            ... on ValueInGame {
              entity_id
              value
            }
          }
        }
      }
    }
  }
}
    `;
export const GetPlayersGamesDocument = gql`
    query getPlayersGames($address: ContractAddress!) {
  ownerModels(where: {address: $address}) {
    edges {
      node {
        entity {
          keys
          models {
            __typename
            ... on Owner {
              entity_id
              address
            }
          }
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const GetGameValuesDocumentString = print(GetGameValuesDocument);
const GetPlayersGamesDocumentString = print(GetPlayersGamesDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getGameValues(variables: GetGameValuesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetGameValuesQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetGameValuesQuery>(GetGameValuesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getGameValues', 'query');
    },
    getPlayersGames(variables: GetPlayersGamesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetPlayersGamesQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetPlayersGamesQuery>(GetPlayersGamesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPlayersGames', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;