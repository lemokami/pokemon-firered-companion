import TypeBadge from "./TypeBadge";

function ChipRow({ label, types, quadTypes, quadLabel, empty }) {
  return (
    <div className="matchup-row">
      <span className="matchup-label">{label}</span>
      <span className="matchup-chips">
        {types.length > 0 ? (
          types.map((t) => (
            <span key={t} className="matchup-chip">
              <TypeBadge type={t} />
              {quadTypes.includes(t) && (
                <span className="quad-tag" title={`${quadLabel} — this type hits twice as hard as a normal weakness/resist`}>
                  {quadLabel}
                </span>
              )}
            </span>
          ))
        ) : (
          <em>{empty}</em>
        )}
      </span>
    </div>
  );
}

export default function TypeMatchups({ weaknesses, resistances, immunities, quadWeaknesses, quadResistances }) {
  return (
    <section className="panel tips-panel">
      <h2>Battle Tips: Type Matchups</h2>
      <p className="panel-hint">Based on this Pokémon's FireRed typing — plan your team and gym battles around these.</p>
      <ChipRow
        label="Weak to (2× damage)"
        types={weaknesses}
        quadTypes={quadWeaknesses}
        quadLabel="4×"
        empty="No common weaknesses"
      />
      <ChipRow
        label="Resists (½ damage)"
        types={resistances}
        quadTypes={quadResistances}
        quadLabel="¼×"
        empty="No resistances"
      />
      <ChipRow label="Immune to" types={immunities} quadTypes={[]} quadLabel="" empty="No immunities" />
    </section>
  );
}
