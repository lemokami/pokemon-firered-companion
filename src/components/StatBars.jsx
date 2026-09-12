const STAT_LABELS = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};
const MAX_STAT = 255; // the actual maximum a base stat can be, so bars never clip (e.g. Chansey's 250 HP)

export default function StatBars({ stats }) {
  const total = Object.values(stats).reduce((sum, v) => sum + v, 0);
  return (
    <section className="panel">
      <h2>Base Stats</h2>
      <div className="stat-bars">
        {Object.entries(STAT_LABELS).map(([key, label]) => {
          const value = stats[key] ?? 0;
          const pct = Math.min(100, (value / MAX_STAT) * 100);
          return (
            <div className="stat-row" key={key}>
              <span className="stat-label">{label}</span>
              <span className="stat-value">{value}</span>
              <div className="stat-bar-track">
                <div className="stat-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
        <div className="stat-row stat-total-row">
          <span className="stat-label">Total</span>
          <span className="stat-value">{total}</span>
        </div>
      </div>
    </section>
  );
}
