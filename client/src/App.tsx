import { useState, useEffect } from 'react';
import { useDojo } from './DojoContext';
import { useSpellcrafter } from './SpellcrafterContext';
import cardDefs from './generated/cards.json';

function App() {
  const {
    account: { create, list, select, account, isDeploying }
  } = useDojo();

  const {
    actions: { newGame, forage, interact },
    games,
    setActiveGame,
    activeGame,
    stats,
    cards,
  } = useSpellcrafter();

  const [selectedRegion, setSelectedRegion] = useState<Region>(Region.Forest);
  const [selectedCard, setSelectedCard] = useState<number | undefined>(undefined);

  // update the selected card when the cards change
  useEffect(() => {
    setSelectedCard(cards[0]?.[0]);
  }, [cards])


  return (
    <>
      <button onClick={create}>{isDeploying ? "deploying account contract..." : "create arcade account"}</button>

      <div className="card">
        select signer:{" "}
        <select value={account.address} onChange={e => select(e.target.value)}>
          {list().map((account, index) => {
            return <option value={account.address} key={index}>{account.address}</option>
          })}
        </select>
      </div>

      <button onClick={() => newGame()}>New Game</button>

      <div className="card">
        select game:{" "}
        <select value={activeGame as any as string} onChange={e => setActiveGame(e.target.value as any)}>
          {games.map((game, index) => {
            return <option value={game} key={index}>{game}</option>
          })}
        </select>
      </div>

      <div className="card">
        <p>{JSON.stringify(stats)}</p>
      </div>

      <div className="card">
        {cards.map(([id, count]) => {
          return <p key={id}>{cardDefs[id].name}: {count}</p>
        })}
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
        <select value={selectedCard} onChange={e => setSelectedCard(parseInt(e.target.value))}>
          {cards.map(([cardId, _], index) => {
            return <option value={cardId} key={index}>{cardDefs[cardId].name}</option>
          })}
        </select>
        <button onClick={() => {if (selectedCard) interact(selectedCard)}}>Play</button>
      </div>

    </>
  );
}

export default App;
