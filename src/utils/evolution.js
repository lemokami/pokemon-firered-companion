import pokemon from "../data/pokemon.json";

export const byId = new Map(pokemon.map((p) => [p.id, p]));

// Walks up evolvesFromId to find the base species of a Pokemon's family.
export function getRootId(id) {
  let current = byId.get(id);
  while (current?.evolvesFromId && byId.has(current.evolvesFromId)) {
    current = byId.get(current.evolvesFromId);
  }
  return current?.id ?? id;
}

// All member ids of a family (root + every stage it evolves into), used to
// group the Pokedex list and to match search/filter against a whole line.
export function getFamilyMemberIds(rootId) {
  const ids = [];
  const visit = (id) => {
    ids.push(id);
    const mon = byId.get(id);
    for (const evo of mon?.evolutions ?? []) visit(evo.toId);
  };
  visit(rootId);
  return ids;
}

// One entry per evolution family in the Kanto Dex, ordered by root dex number.
export const FAMILIES = (() => {
  const roots = new Map();
  for (const p of pokemon) {
    const rootId = getRootId(p.id);
    if (!roots.has(rootId)) roots.set(rootId, getFamilyMemberIds(rootId));
  }
  return [...roots.entries()]
    .map(([rootId, memberIds]) => ({ rootId, memberIds }))
    .sort((a, b) => a.rootId - b.rootId);
})();
