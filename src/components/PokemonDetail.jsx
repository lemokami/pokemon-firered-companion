import { Link, useParams } from "react-router-dom";
import { byId } from "../utils/evolution";
import TypeBadge from "./TypeBadge";
import StatBars from "./StatBars";
import EvolutionChain from "./EvolutionChain";
import BestAttacks from "./BestAttacks";
import MoveTable from "./MoveTable";
import TypeMatchups from "./TypeMatchups";
import WhereToFind from "./WhereToFind";

export default function PokemonDetail() {
  const { id } = useParams();
  const mon = byId.get(Number(id));

  if (!mon) {
    return (
      <div className="pokemon-detail">
        <p>Pokémon not found.</p>
        <Link to="/pokedex">← Back to Pokédex</Link>
      </div>
    );
  }

  const prevId = mon.id > 1 ? mon.id - 1 : null;
  const nextId = mon.id < 151 ? mon.id + 1 : null;

  return (
    <div className="pokemon-detail">
      <div className="detail-pager">
        <Link to="/pokedex">← Back to Pokédex</Link>
        <span>
          {prevId && <Link to={`/pokedex/${prevId}`}>‹ #{String(prevId).padStart(3, "0")}</Link>}{" "}
          {nextId && <Link to={`/pokedex/${nextId}`}>#{String(nextId).padStart(3, "0")} ›</Link>}
        </span>
      </div>

      <header className="detail-header">
        <span className="sprite-frame sprite-frame-lg">
          <img src={mon.sprite} alt={mon.name} className="pixel-sprite" />
        </span>
        <div>
          <p className="detail-id">#{String(mon.id).padStart(3, "0")}</p>
          <h1>{mon.name}</h1>
          <p className="detail-genus">{mon.genus}</p>
          <div className="detail-types">
            {mon.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
          {mon.abilities.length > 0 && (
            <div className="detail-abilities">
              <span className="detail-abilities-label">{mon.abilities.length > 1 ? "Abilities" : "Ability"}</span>
              {mon.abilities.map((a) => (
                <p key={a.name} className="detail-ability">
                  <strong>{a.name}</strong>
                  {a.description && ` — ${a.description}`}
                </p>
              ))}
            </div>
          )}
          {mon.flavorText.firered && <p className="detail-flavor">{mon.flavorText.firered}</p>}
        </div>
      </header>

      <WhereToFind mon={mon} />

      <StatBars stats={mon.stats} />

      <section className="panel">
        <h2>Evolution</h2>
        <EvolutionChain pokemonId={mon.id} />
      </section>

      <BestAttacks attacks={mon.bestAttacks} />

      <MoveTable moves={mon.levelUpMoves} />

      <TypeMatchups
        weaknesses={mon.weaknesses}
        resistances={mon.resistances}
        immunities={mon.immunities}
        quadWeaknesses={mon.quadWeaknesses}
        quadResistances={mon.quadResistances}
      />
    </div>
  );
}
