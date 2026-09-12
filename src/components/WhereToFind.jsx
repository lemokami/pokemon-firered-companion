import { Link } from "react-router-dom";
import { byId } from "../utils/evolution";

export default function WhereToFind({ mon }) {
  if (mon.locations.length > 0) {
    return (
      <section className="panel">
        <h2>Where to Find</h2>
        <div className="move-table-wrap">
          <table className="move-table location-table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Method</th>
                <th>Level</th>
                <th>Chance</th>
              </tr>
            </thead>
            <tbody>
              {mon.locations.map((loc, i) => (
                <tr key={i}>
                  <td>{loc.area}</td>
                  <td>
                    {loc.method}
                    {loc.notes.length > 0 && <span className="location-note"> ({loc.notes.join("; ")})</span>}
                  </td>
                  <td>{loc.levelRange}</td>
                  <td>{loc.chance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  // Not caught in the wild — explain how it's actually obtained instead,
  // using the same evolution data the Evolution panel draws from.
  const parent = mon.evolvesFromId ? byId.get(mon.evolvesFromId) : null;
  const evoNote = parent?.evolutions.find((e) => e.toId === mon.id)?.notes[0];
  const howLabel = evoNote ? evoNote.split("→")[0].trim() : null;

  return (
    <section className="panel">
      <h2>Where to Find</h2>
      {parent ? (
        <p>
          Not found in the wild in FireRed — evolve{" "}
          <Link to={`/pokedex/${parent.id}`} className="inline-link">
            {parent.name}
          </Link>
          {howLabel ? ` (${howLabel})` : ""} to get one.
        </p>
      ) : (
        <p>
          Not available by wild encounter in FireRed — it's obtained as a starter, gift, fossil, trade, or
          other special in-game event rather than found in the grass.
        </p>
      )}
    </section>
  );
}
