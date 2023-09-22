import { useState } from 'react';
import { useDojo } from './DojoContext';
import { useEntityQuery, useComponentValue } from '@dojoengine/react';
import { getEntityIdFromKeys } from '@dojoengine/utils';
import { setComponent, HasValue } from '@latticexyz/recs';
import { useEffect } from 'react';
import { SpellStats, SpellStatsDisplay } from './dojo/gameConfig';

function App() {
  const {
    setup: {
      systemCalls: { newGame },
      components: { ValueInGame, Owner },
      network: { graphSdk }
    },
    account: { create, list, select, account, isDeploying }
  } = useDojo();

  let [selectedGame, setSelectedGame] = useState<string>("0")

  let player_games = useEntityQuery([HasValue(Owner, { address: account.address })]);

  // use a graphql query to populate the local store for ownerComponents
  useEffect(() => {
    if (!account.address) return;
    const fetchGames = async () => {
      const { data: { ownerComponents } } = await graphSdk.getPlayersGames({ address: account.address });
      ownerComponents?.edges?.forEach((entity) => {
        let keys = entity?.node?.entity?.keys
        const entityIndex = getEntityIdFromKeys(keys);
        entity?.node?.entity?.components?.forEach((component) => {
          switch (component?.__typename) {
            case "Owner":
              setComponent(Owner, entityIndex, { address: component?.address })
              break;
            default:
              break;
          }
        })
      })
    }
    fetchGames();
  }, [account.address]);

  // use a graphql query to populate the game data
  useEffect(() => {
    if (!selectedGame) return;
    const fetchGames = async () => {
      const { data: { valueingameComponents } } = await graphSdk.getGameValues({ game_id: "0x" + Number(selectedGame).toString(16) });
      valueingameComponents?.edges?.forEach((entity) => {
        let keys = entity?.node?.entity?.keys?.map((key) => BigInt(key!))
        const entityIndex = getEntityIdFromKeys(keys);
        entity?.node?.entity?.components?.forEach((component) => {
          switch (component?.__typename) {
            case "ValueInGame":
              setComponent(ValueInGame, entityIndex, { value: component?.value })
              break;
            default:
              break;
          }
        })
      })
    }
    fetchGames();
  }, [selectedGame]);

  return (
    <>
      <button onClick={create}>{isDeploying ? "deploying burner" : "create burner"}</button>

      <div className="card">
        select signer:{" "}
        <select onChange={e => select(e.target.value)}>
          {list().map((account, index) => {
            return <option value={account.address} key={index}>{account.address}</option>
          })}
        </select>
      </div>

      <button onClick={() => newGame(account)}>New Game</button>

      <div className="card">
        select game:{" "}
        <select onChange={e => setSelectedGame(e.target.value)}>
          {player_games.map((game, index) => {
            return <option value={game} key={index}>{game}</option>
          })}
        </select>
      </div>

      <div className="card">
        <table>
          {Object.values(SpellStats).filter(value => typeof value === 'number').map((spellStat) => {
            let value = useComponentValue(ValueInGame, getEntityIdFromKeys([BigInt(spellStat), BigInt(parseInt(selectedGame!))]));
            return (
              <tr>
                <th>{SpellStatsDisplay[spellStat as SpellStats]}</th>
                <th>{value?.value}</th>
              </tr>
            )
          })}
        </table>
      </div>
    </>
  );
}

export default App;
