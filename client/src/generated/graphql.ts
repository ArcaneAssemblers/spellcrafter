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
  felt252: { input: any; output: any; }
  u32: { input: any; output: any; }
  u128: { input: any; output: any; }
};

export type Component = {
  __typename?: 'Component';
  classHash?: Maybe<Scalars['felt252']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  transactionHash?: Maybe<Scalars['felt252']['output']>;
};

export type ComponentConnection = {
  __typename?: 'ComponentConnection';
  edges?: Maybe<Array<Maybe<ComponentEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type ComponentEdge = {
  __typename?: 'ComponentEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Component>;
};

export type ComponentUnion = Occupied | Owner | ValueInGame;

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Entity = {
  __typename?: 'Entity';
  componentNames?: Maybe<Scalars['String']['output']>;
  components?: Maybe<Array<Maybe<ComponentUnion>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type EntityConnection = {
  __typename?: 'EntityConnection';
  edges?: Maybe<Array<Maybe<EntityEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type EntityEdge = {
  __typename?: 'EntityEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Entity>;
};

export type Event = {
  __typename?: 'Event';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Scalars['String']['output']>;
  systemCall: SystemCall;
  systemCallId?: Maybe<Scalars['Int']['output']>;
};

export type EventConnection = {
  __typename?: 'EventConnection';
  edges?: Maybe<Array<Maybe<EventEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Event>;
};

export type Occupied = {
  __typename?: 'Occupied';
  entity?: Maybe<Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
  until?: Maybe<Scalars['u128']['output']>;
};

export type OccupiedConnection = {
  __typename?: 'OccupiedConnection';
  edges?: Maybe<Array<Maybe<OccupiedEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type OccupiedEdge = {
  __typename?: 'OccupiedEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Occupied>;
};

export type OccupiedOrder = {
  direction: Direction;
  field: OccupiedOrderOrderField;
};

export enum OccupiedOrderOrderField {
  EntityId = 'ENTITY_ID',
  Until = 'UNTIL'
}

export type OccupiedWhereInput = {
  entity_id?: InputMaybe<Scalars['String']['input']>;
  entity_idGT?: InputMaybe<Scalars['String']['input']>;
  entity_idGTE?: InputMaybe<Scalars['String']['input']>;
  entity_idLT?: InputMaybe<Scalars['String']['input']>;
  entity_idLTE?: InputMaybe<Scalars['String']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['String']['input']>;
  until?: InputMaybe<Scalars['String']['input']>;
  untilGT?: InputMaybe<Scalars['String']['input']>;
  untilGTE?: InputMaybe<Scalars['String']['input']>;
  untilLT?: InputMaybe<Scalars['String']['input']>;
  untilLTE?: InputMaybe<Scalars['String']['input']>;
  untilNEQ?: InputMaybe<Scalars['String']['input']>;
};

export type Owner = {
  __typename?: 'Owner';
  address?: Maybe<Scalars['ContractAddress']['output']>;
  entity?: Maybe<Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
};

export type OwnerConnection = {
  __typename?: 'OwnerConnection';
  edges?: Maybe<Array<Maybe<OwnerEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type OwnerEdge = {
  __typename?: 'OwnerEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Owner>;
};

export type OwnerOrder = {
  direction: Direction;
  field: OwnerOrderOrderField;
};

export enum OwnerOrderOrderField {
  Address = 'ADDRESS',
  EntityId = 'ENTITY_ID'
}

export type OwnerWhereInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  addressGT?: InputMaybe<Scalars['String']['input']>;
  addressGTE?: InputMaybe<Scalars['String']['input']>;
  addressLT?: InputMaybe<Scalars['String']['input']>;
  addressLTE?: InputMaybe<Scalars['String']['input']>;
  addressNEQ?: InputMaybe<Scalars['String']['input']>;
  entity_id?: InputMaybe<Scalars['String']['input']>;
  entity_idGT?: InputMaybe<Scalars['String']['input']>;
  entity_idGTE?: InputMaybe<Scalars['String']['input']>;
  entity_idLT?: InputMaybe<Scalars['String']['input']>;
  entity_idLTE?: InputMaybe<Scalars['String']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  component: Component;
  components?: Maybe<ComponentConnection>;
  entities?: Maybe<EntityConnection>;
  entity: Entity;
  event: Event;
  events?: Maybe<EventConnection>;
  occupiedComponents?: Maybe<OccupiedConnection>;
  ownerComponents?: Maybe<OwnerConnection>;
  system: System;
  systemCall: SystemCall;
  systemCalls?: Maybe<SystemCallConnection>;
  systems?: Maybe<SystemConnection>;
  valueingameComponents?: Maybe<ValueInGameConnection>;
};


export type QueryComponentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEntityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOccupiedComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OccupiedOrder>;
  where?: InputMaybe<OccupiedWhereInput>;
};


export type QueryOwnerComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OwnerOrder>;
  where?: InputMaybe<OwnerWhereInput>;
};


export type QuerySystemArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySystemCallArgs = {
  id: Scalars['Int']['input'];
};


export type QueryValueingameComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<ValueInGameOrder>;
  where?: InputMaybe<ValueInGameWhereInput>;
};

export type Subscription = {
  __typename?: 'Subscription';
  componentRegistered: Component;
  entityUpdated: Entity;
};

export type System = {
  __typename?: 'System';
  classHash?: Maybe<Scalars['felt252']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  systemCalls: Array<SystemCall>;
  transactionHash?: Maybe<Scalars['felt252']['output']>;
};

export type SystemCall = {
  __typename?: 'SystemCall';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  system: System;
  systemId?: Maybe<Scalars['ID']['output']>;
  transactionHash?: Maybe<Scalars['String']['output']>;
};

export type SystemCallConnection = {
  __typename?: 'SystemCallConnection';
  edges?: Maybe<Array<Maybe<SystemCallEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type SystemCallEdge = {
  __typename?: 'SystemCallEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<SystemCall>;
};

export type SystemConnection = {
  __typename?: 'SystemConnection';
  edges?: Maybe<Array<Maybe<SystemEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type SystemEdge = {
  __typename?: 'SystemEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<System>;
};

export type ValueInGame = {
  __typename?: 'ValueInGame';
  entity?: Maybe<Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
  game_id?: Maybe<Scalars['u128']['output']>;
  value?: Maybe<Scalars['u32']['output']>;
};

export type ValueInGameConnection = {
  __typename?: 'ValueInGameConnection';
  edges?: Maybe<Array<Maybe<ValueInGameEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type ValueInGameEdge = {
  __typename?: 'ValueInGameEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<ValueInGame>;
};

export type ValueInGameOrder = {
  direction: Direction;
  field: ValueInGameOrderOrderField;
};

export enum ValueInGameOrderOrderField {
  EntityId = 'ENTITY_ID',
  GameId = 'GAME_ID',
  Value = 'VALUE'
}

export type ValueInGameWhereInput = {
  entity_id?: InputMaybe<Scalars['String']['input']>;
  entity_idGT?: InputMaybe<Scalars['String']['input']>;
  entity_idGTE?: InputMaybe<Scalars['String']['input']>;
  entity_idLT?: InputMaybe<Scalars['String']['input']>;
  entity_idLTE?: InputMaybe<Scalars['String']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['String']['input']>;
  game_id?: InputMaybe<Scalars['String']['input']>;
  game_idGT?: InputMaybe<Scalars['String']['input']>;
  game_idGTE?: InputMaybe<Scalars['String']['input']>;
  game_idLT?: InputMaybe<Scalars['String']['input']>;
  game_idLTE?: InputMaybe<Scalars['String']['input']>;
  game_idNEQ?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['Int']['input']>;
  valueGT?: InputMaybe<Scalars['Int']['input']>;
  valueGTE?: InputMaybe<Scalars['Int']['input']>;
  valueLT?: InputMaybe<Scalars['Int']['input']>;
  valueLTE?: InputMaybe<Scalars['Int']['input']>;
  valueNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type GetEntitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEntitiesQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, components?: Array<{ __typename: 'Occupied' } | { __typename: 'Owner', address?: any | null } | { __typename: 'ValueInGame' } | null> | null } | null } | null> | null } | null };


export const GetEntitiesDocument = gql`
    query getEntities {
  entities(keys: ["%"]) {
    edges {
      node {
        keys
        components {
          __typename
          ... on Owner {
            address
          }
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const GetEntitiesDocumentString = print(GetEntitiesDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getEntities(variables?: GetEntitiesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetEntitiesQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntitiesQuery>(GetEntitiesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntities', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;