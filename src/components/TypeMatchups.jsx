import TypeBadge from "./TypeBadge";

function ChipRow({ label, types, empty }) {
  return (
    <div className="matchup-row">
      <span className="matchup-label">{label}</span>
      <span className="matchup-chips">
        {types.length > 0 ? types.map((t) => <TypeBadge key={t} type={t} />) : <em>{empty}</em>}
      </span>
    </div>
  );
}

export default function TypeMatchups({ weaknesses, resistances, immunities }) {
  return (
    <section className="panel tips-panel">
      <h2>Battle Tips: Type Matchups</h2>
      <p className="panel-hint">Based on this Pokémon's FireRed typing — plan your team and gym battles around these.</p>
      <ChipRow label="Weak to (2× damage)" types={weaknesses} empty="No common weaknesses" />
      <ChipRow label="Resists (½ damage)" types={resistances} empty="No resistances" />
      <ChipRow label="Immune to" types={immunities} empty="No immunities" />
    </section>
  );
}
