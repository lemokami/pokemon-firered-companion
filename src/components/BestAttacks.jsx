import TypeBadge from "./TypeBadge";

export default function BestAttacks({ attacks }) {
  if (!attacks || attacks.length === 0) {
    return (
      <section className="panel best-attacks">
        <h2>Recommended Attacks</h2>
        <p>No damaging level-up moves found in FireRed/LeafGreen — check the TM/tutor list in-game.</p>
      </section>
    );
  }
  return (
    <section className="panel best-attacks">
      <h2>Recommended Attacks</h2>
      <p className="panel-hint">Best level-up moves for this Pokémon in FireRed/LeafGreen — same-type moves prioritized.</p>
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
