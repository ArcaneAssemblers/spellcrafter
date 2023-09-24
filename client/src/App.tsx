import { useDojo } from './DojoContext';
import { useSpellcrafter } from './SpellcrafterContext';
import { Region } from './dojo/gameConfig';

function App() {
  const {
    setup: {
      components: { ValueInGame, Owner },
      network: { graphSdk }
    },
    account: { create, list, select, account, isDeploying }
  } = useDojo();

  const {
    actions: { newGame, forage },
    games,
    setActiveGame,
    stats,
    cards,
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

      <div className="card">
        <p>{JSON.stringify(cards)}</p>
      </div>

      <div className="card">
        <select>
          {Object.keys(Region).filter(e => isNaN(Number(e))).map((value, index) => {
            return <option value={value} key={index}>{value}</option>
          })}
        </select>
        <button onClick={() => forage(Region.Cave)}>Forage</button>
      </div>

      {/* <div className="card">
        <button onClick={() => newGame()}>Interact</button>
      </div> */}

    </>
  );
}

export default App;
