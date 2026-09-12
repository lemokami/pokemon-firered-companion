import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import pokemon from "../data/pokemon.json";
import TypeBadge from "./TypeBadge";

const ALL_TYPES = [...new Set(pokemon.flatMap((p) => p.types))].sort();

export default function PokedexList() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pokemon.filter((p) => {
      const matchesQuery = q === "" || p.name.toLowerCase().includes(q) || String(p.id) === q;
      const matchesType = typeFilter === "" || p.types.includes(typeFilter);
      return matchesQuery && matchesType;
    });
  }, [query, typeFilter]);

  return (
    <div className="pokedex-page">
      <div className="pokedex-controls">
        <input
          type="text"
          placeholder="Search by name or #..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="type-select">
          <option value="">All types</option>
          {ALL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <p className="result-count">
        {filtered.length} of {pokemon.length} Pokémon
      </p>

      <div className="pokedex-grid">
        {filtered.map((p) => (
          <Link to={`/pokedex/${p.id}`} key={p.id} className="pokemon-card">
            <span className="pokemon-card-id">#{String(p.id).padStart(3, "0")}</span>
            <span className="sprite-frame">
              <img src={p.sprite} alt={p.name} loading="lazy" className="pixel-sprite" />
            </span>
            <span className="pokemon-card-name">{p.name}</span>
            <span className="pokemon-card-types">
              {p.types.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
