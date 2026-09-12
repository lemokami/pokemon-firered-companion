import TypeBadge from "./TypeBadge";

export default function BestAttacks({ attacks }) {
  if (!attacks || attacks.length === 0) {
    return (
      <section className="panel best-attacks">
        <h2>Recommended Attacks</h2>
        <p>No strong damaging moves found for this Pokémon in FireRed/LeafGreen.</p>
      </section>
    );
  }
  return (
    <section className="panel best-attacks">
      <h2>Recommended Attacks</h2>
      <p className="panel-hint">
        Picked from this Pokémon's level-up and TM/HM moves in FireRed/LeafGreen. A move that matches
        the Pokémon's own type gets a same-type attack bonus (STAB) — <strong>1.5× damage in-game</strong> —
        so those are ranked first, then by raw power.
      </p>
      <div className="best-attacks-grid">
        {attacks.map((a) => (
          <div className="best-attack-card" key={a.name}>
            <div className="best-attack-head">
              <strong>{a.name}</strong>
              <TypeBadge type={a.type} />
            </div>
            <div className="best-attack-meta">
              <span className="damage-class">{a.damageClass}</span>
              <span>{a.power} power</span>
            </div>
            <p className="best-attack-reason">{a.reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
