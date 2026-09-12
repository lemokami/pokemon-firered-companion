import { useState } from "react";
import { Link } from "react-router-dom";
import { byId } from "../utils/evolution";
import { PLACES, STARTERS, CORE_SLOTS, resolveStage } from "../data/recommendedTeams";
import TypeBadge from "./TypeBadge";

function loadStarter() {
  try {
    const saved = localStorage.getItem("firered-companion:starter");
    return saved && STARTERS[saved] ? saved : "bulbasaur";
  } catch {
    return "bulbasaur";
  }
}

function MatchupTag({ mon, gymType }) {
  if (!gymType) return null;
  if (mon.immunities.includes(gymType) || mon.resistances.includes(gymType)) {
    return <span className="matchup-tag good">resists {gymType}</span>;
  }
  if (mon.weaknesses.includes(gymType)) {
    return <span className="matchup-tag bad">weak to {gymType}</span>;
  }
  return null;
}

function RosterSlot({ role, why, monId, gymType }) {
  if (!monId) {
    return (
      <div className="roster-slot pending">
        <div className="roster-slot-placeholder">?</div>
        <div className="roster-slot-info">
          <span className="roster-slot-role">{role}</span>
          <span className="roster-slot-status">Not caught yet</span>
        </div>
      </div>
    );
  }
  const mon = byId.get(monId);
  return (
    <Link to={`/pokedex/${mon.id}`} className="roster-slot" title={why}>
      <img src={mon.sprite} alt={mon.name} className="pixel-sprite roster-sprite" />
      <div className="roster-slot-info">
        <span className="roster-slot-role">{role}</span>
        <span className="roster-slot-name">{mon.name}</span>
        <span className="roster-slot-types">
          {mon.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
          <MatchupTag mon={mon} gymType={gymType} />
        </span>
      </div>
    </Link>
  );
}

export default function RecommendedTeams() {
  const [starterKey, setStarterKey] = useState(loadStarter);

  const chooseStarter = (key) => {
    setStarterKey(key);
    try {
      localStorage.setItem("firered-companion:starter", key);
    } catch {
      // ignore - just a per-viewer convenience
    }
  };

  const starter = STARTERS[starterKey];

  return (
    <div className="teams-page">
      <section className="panel tips-panel">
        <h2>Recommended Roster</h2>
        <p className="panel-hint">
          One team of 6, built up gradually from Pokémon you can realistically have caught by each gym —
          grounded in this app's own location data, not a wishlist. Pick your starter, then scroll down to
          see the roster grow checkpoint by checkpoint.
        </p>
        <div className="starter-picker">
          {Object.entries(STARTERS).map(([key, s]) => (
            <button
              key={key}
              className={`starter-option ${key === starterKey ? "selected" : ""}`}
              onClick={() => chooseStarter(key)}
            >
              <img src={byId.get(s.stages[0].id).sprite} alt={s.name} className="pixel-sprite" />
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </section>

      {PLACES.map((place) => {
        const slots = [
          { role: "Starter", why: "Your chosen starter.", monId: resolveStage(starter.stages, place.order) },
          ...CORE_SLOTS.map((slot) => ({
            role: slot.role,
            why: slot.why,
            monId: resolveStage(slot.stages, place.order),
          })),
        ];
        return (
          <section key={place.id} className="panel place-card">
            <h2>
              {place.order}. {place.name}
              {place.leader && (
                <span className="place-leader">
                  {" "}
                  — {place.leader} {place.type && <TypeBadge type={place.type} />}
                </span>
              )}
            </h2>
            <div className="roster-grid">
              {slots.map((slot, i) => (
                <RosterSlot key={i} role={slot.role} why={slot.why} monId={slot.monId} gymType={place.type} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="panel tips-panel">
        <h2>Why These Picks</h2>
        <ul className="tips-list">
          {CORE_SLOTS.map((slot) => (
            <li key={slot.id}>
              <strong>{byId.get(slot.stages.at(-1).id).name}</strong> ({slot.role}) — {slot.why}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
