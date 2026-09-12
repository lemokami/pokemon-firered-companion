import { useMemo, useState } from "react";
import pokemon from "../data/pokemon.json";
import { byId, FAMILIES } from "../utils/evolution";
import { EvolutionTree } from "./EvolutionChain";

const ALL_TYPES = [...new Set(pokemon.flatMap((p) => p.types))].sort();

export default function PokedexList() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAMILIES.filter((family) => {
      const members = family.memberIds.map((id) => byId.get(id));
      const matchesQuery =
        q === "" || members.some((m) => m.name.toLowerCase().includes(q) || String(m.id) === q);
      const matchesType = typeFilter === "" || members.some((m) => m.types.includes(typeFilter));
      return matchesQuery && matchesType;
    });
  }, [query, typeFilter]);

  const shownCount = filtered.reduce((sum, f) => sum + f.memberIds.length, 0);

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
        {filtered.length} of {FAMILIES.length} evolution families ({shownCount} of {pokemon.length} Pokémon)
      </p>

      <div className="family-list">
        {filtered.map((family) => (
          <div key={family.rootId} className="family-card">
            <EvolutionTree rootId={family.rootId} richInfo />
          </div>
        ))}
      </div>
    </div>
  );
}
