import {useState} from 'react';
import { useDojo } from './DojoContext';
import { useSpellcrafter } from './SpellcrafterContext';
import { Region, RegionDisplay } from './dojo/gameConfig';

function App() {
  const {
    setup: {
      components: { ValueInGame, Owner },
      network: { graphSdk }
    },
    account: { create, list, select, account, isDeploying }
  } = useDojo();

  const {
    actions: { newGame, forage, interact },
    games,
    setActiveGame,
    stats,
    cards,
  } = useSpellcrafter();

  const [selectedRegion, setSelectedRegion] = useState(Region.Forest);
  const [selectedCard, setSelectedCard] = useState(Region.Forest);

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
        <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value as any as Region)}>
          {Object.values(Region).filter(value => typeof value === 'number').map((value: any, index) => {
            return <option value={value as Region} key={index}>{RegionDisplay[value as Region]}</option>
          })}
        </select>
        <button onClick={() => forage(selectedRegion)}>Forage</button>
      </div>

      <div className="card">
        <select value={selectedCard} onChange={e => setSelectedCard(e.target.value as any as Region)}>
          {cards.map(([cardId, _], index) => {
            return <option value={cardId} key={index}>{cardId}</option>
          })}
        </select>
        <button onClick={() => interact(selectedCard)}>Play</button>
      </div>

    </>
  );
}

export default App;
