import { useDojo } from './DojoContext';
import { useSpellcrafter } from './SpellcrafterContext';

function App() {
  const {
    setup: {
      components: { ValueInGame, Owner },
      network: { graphSdk }
    },
    account: { create, list, select, account, isDeploying }
  } = useDojo();

  const {
    actions: { newGame },
    games,
    setActiveGame,
    stats,
  } = useSpellcrafter();

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

      <button onClick={() => newGame()}>New Game</button>

      <div className="card">
        select game:{" "}
        <select onChange={e => setActiveGame(e.target.value as any)}>
          {games.map((game, index) => {
            return <option value={game} key={index}>{game}</option>
          })}
        </select>
      </div>

      <div className="card">
        <p>{JSON.stringify(stats)}</p>
      </div>
    </>
  );
}

export default App;
