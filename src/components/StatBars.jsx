const STAT_LABELS = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};
const MAX_STAT = 180; // roughly the ceiling for base stats among the Kanto 151, for bar scaling

export default function StatBars({ stats }) {
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
      </div>
    </section>
  );
}
