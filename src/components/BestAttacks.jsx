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
        Picked from moves this Pokémon learns by leveling up or via a TM/HM (Technical/Hidden Machine —
        an item that teaches a move outright, used once per TM in this game) in FireRed. A move that
        matches the Pokémon's own type gets a same-type attack bonus (STAB) —{" "}
        <strong>1.5× damage in-game</strong> — so those are ranked first, then by raw power.
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
            <span
              className="unlocked-at-badge"
              title={
                a.unlockedAt === "TM/HM"
                  ? "Taught with a TM/HM item (Technical/Hidden Machine), not learned by leveling up"
                  : undefined
              }
            >
              Unlocked: {a.unlockedAt}
            </span>
            <p className="best-attack-reason">{a.reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
