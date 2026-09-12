import { Link } from "react-router-dom";
import pokemon from "../data/pokemon.json";

const byId = new Map(pokemon.map((p) => [p.id, p]));

function findRootId(id) {
  let current = byId.get(id);
  while (current?.evolvesFromId) current = byId.get(current.evolvesFromId);
  return current?.id ?? id;
}

function Stage({ id, currentId }) {
  const mon = byId.get(id);
  if (!mon) return null;
  return (
    <Link to={`/pokedex/${mon.id}`} className={`evo-stage ${mon.id === currentId ? "current" : ""}`}>
      <img src={mon.sprite} alt={mon.name} className="pixel-sprite evo-sprite" />
      <span>{mon.name}</span>
    </Link>
  );
}

// Renders one species and, recursively, everything it evolves into, as ONE
// connected flow rather than separate floating cards per stage. A straight
// line (the common case) reads as a single horizontal strip; a branch (e.g.
// Eevee) fans out into a connected list under its parent, still inside the
// same card.
function Branch({ id, currentId }) {
  const mon = byId.get(id);
  if (!mon) return null;
  if (mon.evolutions.length === 0) {
    return <Stage id={id} currentId={currentId} />;
  }
  return (
    <div className="evo-branch">
      <Stage id={id} currentId={currentId} />
      <div className={mon.evolutions.length > 1 ? "evo-branch-children multi" : "evo-branch-children"}>
        {mon.evolutions.map((evo) => (
          <div className="evo-arrow-group" key={evo.toId}>
            <div className="evo-arrow">
              <span className="evo-arrow-line">→</span>
              <span className="evo-arrow-label">{evo.notes[0].split("→")[0].trim()}</span>
            </div>
            <Branch id={evo.toId} currentId={currentId} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EvolutionChain({ pokemonId }) {
  const rootId = findRootId(pokemonId);
  const root = byId.get(rootId);
  if (!root) return null;

  if (root.evolutions.length === 0 && !root.evolvesFromId) {
    return <p className="evo-none">{root.name} does not evolve.</p>;
  }

  return (
    <div className="evolution-chain">
      <Branch id={rootId} currentId={pokemonId} />
    </div>
  );
}
