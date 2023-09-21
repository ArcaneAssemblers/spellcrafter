import { useState } from 'react';
import { useDojo } from './DojoContext';
import { EntityIndex, setComponent } from '@latticexyz/recs';
import { useEffect } from 'react';
import { getFirstComponentByType } from './utils';
import { ValueInGame, Owner } from './generated/graphql';

function App() {
  const {
    setup: {
      systemCalls: { newGame },
      components: { ValueInGame, Owner },
      network: { graphSdk, call }
    },
    account: { create, list, select, account, isDeploying }
  } = useDojo();

  let [games, setGames] = useState<Array<string>>([]);
  let [game, setGame] = useState<string>("");
  let [values, setValues] = useState<Array<[string, Number]>>([]);


  useEffect(() => {
    if (!account.address) return;
    const fetchGames = async () => {
      const { data } = await graphSdk.getPlayersGames({ address: account.address });
      setGames(data.ownerComponents?.edges?.map((edge) => edge?.node?.entity_id) || []);
    }
    fetchGames();
  }, [account.address]);

  useEffect(() => {
    if (!game) return;
    const fetchValues = async () => {
      const { data } = await graphSdk.getGameValues({ game_id: game! });
      console.log(data)
    }
    fetchValues();
  }, [game]);  

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
        <select onChange={e => setGame(e.target.value)}>
          {games.map((game_id, index) => {
            return <option value={game_id} key={index}>{game_id}</option>
          })}
        </select>
      </div>


    </>
  );
}

export default App;
