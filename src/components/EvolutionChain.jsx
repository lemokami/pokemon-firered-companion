import { Link } from "react-router-dom";
import { byId, getRootId } from "../utils/evolution";
import TypeBadge from "./TypeBadge";

function Stage({ id, currentId, richInfo }) {
  const mon = byId.get(id);
  if (!mon) return null;
  return (
    <Link to={`/pokedex/${mon.id}`} className={`evo-stage ${mon.id === currentId ? "current" : ""}`}>
      <img src={mon.sprite} alt={mon.name} className="pixel-sprite evo-sprite" />
      <span className="evo-stage-info">
        {richInfo && <span className="evo-stage-id">#{String(mon.id).padStart(3, "0")}</span>}
        <span className="evo-stage-name">{mon.name}</span>
        {richInfo && (
          <span className="evo-stage-types">
            {mon.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </span>
        )}
      </span>
    </Link>
  );
}

// Renders one species and, recursively, everything it evolves into, as ONE
// connected flow rather than separate floating cards per stage. A straight
// line (the common case) reads as a single horizontal strip; a branch (e.g.
// Eevee) fans out into a connected list under its parent, still inside the
// same card.
function Branch({ id, currentId, richInfo }) {
  const mon = byId.get(id);
  if (!mon) return null;
  if (mon.evolutions.length === 0) {
    return <Stage id={id} currentId={currentId} richInfo={richInfo} />;
  }
  return (
    <div className="evo-branch">
      <Stage id={id} currentId={currentId} richInfo={richInfo} />
      <div className={mon.evolutions.length > 1 ? "evo-branch-children multi" : "evo-branch-children"}>
        {mon.evolutions.map((evo) => (
          <div className="evo-arrow-group" key={evo.toId}>
            <div className="evo-arrow">
              <span className="evo-arrow-line">→</span>
              <span className="evo-arrow-label">{evo.notes[0].split("→")[0].trim()}</span>
            </div>
            <Branch id={evo.toId} currentId={currentId} richInfo={richInfo} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Reusable tree renderer — used both by the full evolution panel on a
// Pokemon's detail page and by the grouped family cards in the Pokedex list.
export function EvolutionTree({ rootId, currentId, richInfo = false }) {
  return <Branch id={rootId} currentId={currentId} richInfo={richInfo} />;
}

export default function EvolutionChain({ pokemonId }) {
  const rootId = getRootId(pokemonId);
  const root = byId.get(rootId);
  if (!root) return null;

  if (root.evolutions.length === 0 && !root.evolvesFromId) {
    return <p className="evo-none">{root.name} does not evolve.</p>;
  }

  return (
    <div className="evolution-chain">
      <EvolutionTree rootId={rootId} currentId={pokemonId} />
    </div>
  );
}
