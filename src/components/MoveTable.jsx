import TypeBadge from "./TypeBadge";

export default function MoveTable({ moves }) {
  if (!moves || moves.length === 0) {
    return (
      <section className="panel">
        <h2>Level-Up Movepool</h2>
        <p>No level-up moves recorded for FireRed/LeafGreen.</p>
      </section>
    );
  }
  return (
    <section className="panel">
      <h2>Level-Up Movepool (FireRed/LeafGreen)</h2>
      <div className="move-table-wrap">
        <table className="move-table">
          <thead>
            <tr>
              <th>Lv.</th>
              <th>Move</th>
              <th>Type</th>
              <th>Cat.</th>
              <th>Power</th>
              <th>Acc.</th>
              <th>PP</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((m) => (
              <tr key={`${m.level}-${m.name}`}>
                <td>{m.level}</td>
                <td>{m.name}</td>
                <td>
                  <TypeBadge type={m.type} />
                </td>
                <td className="damage-class">{m.damageClass}</td>
                <td>{m.power ?? "—"}</td>
                <td>{m.accuracy ?? "—"}</td>
                <td>{m.pp ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
