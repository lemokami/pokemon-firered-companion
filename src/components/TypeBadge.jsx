import { typeColor } from "../utils/typeColors";

export default function TypeBadge({ type }) {
  return (
    <span className="type-badge" style={{ backgroundColor: typeColor(type) }}>
      {type}
    </span>
  );
}
