// Builds src/data/pokemon.json from the public PokeAPI (https://pokeapi.co).
// Run with: npm run fetch-data
//
// Produces one consolidated JSON file covering the Kanto Dex (#1-151),
// scoped to what's accurate for Pokemon FireRed/LeafGreen: level-up movepools
// filtered to the "firered-leafgreen" version group, and pre-Gen-VI typing
// (e.g. Clefairy is Normal, not Fairy, in FireRed).

import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, ".cache");
const OUT_FILE = path.join(__dirname, "..", "src", "data", "pokemon.json");
const BASE = "https://pokeapi.co/api/v2";
const DEX_COUNT = 151;
const VERSION_GROUP = "firered-leafgreen";

// Generation name -> ordinal, so we can pick the right historical typing.
// Fairy type didn't exist until Gen VI, so it's excluded here to keep
// weakness/resistance charts accurate to what FireRed's battles can produce.
const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
  "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel",
];

// PokeAPI's move.damage_class reflects the MODERN per-move physical/special
// split (introduced in Gen IV). Generations I-III (including FireRed/LeafGreen)
// used an older rule where category was determined purely by the move's type,
// which disagrees with the modern split for several types (e.g. Dark-type
// moves were Special pre-Gen IV; Crunch/Bite are Physical today). This maps
// each type to its Gen III category so the "Cat." column and move rankings
// are accurate to what FireRed players would actually see.
const GEN3_DAMAGE_CLASS_BY_TYPE = {
  normal: "physical", fighting: "physical", flying: "physical", ground: "physical",
  rock: "physical", bug: "physical", ghost: "physical", poison: "physical", steel: "physical",
  water: "special", grass: "special", fire: "special", ice: "special",
  electric: "special", psychic: "special", dragon: "special", dark: "special",
};

const GEN_ORDER = {
  "generation-i": 1,
  "generation-ii": 2,
  "generation-iii": 3,
  "generation-iv": 4,
  "generation-v": 5,
  "generation-vi": 6,
  "generation-vii": 7,
  "generation-viii": 8,
  "generation-ix": 9,
};
const TARGET_GEN = 3; // FireRed/LeafGreen

function idFromUrl(url) {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

async function cachedFetch(url) {
  await mkdir(CACHE_DIR, { recursive: true });
  const cacheKey = url.replace(/[^a-z0-9]+/gi, "_");
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.json`);
  try {
    const cached = await readFile(cachePath, "utf-8");
    return JSON.parse(cached);
  } catch {
    // not cached, fall through to network
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  const json = await res.json();
  await writeFile(cachePath, JSON.stringify(json));
  return json;
}

// Runs `fn` over `items` with at most `limit` in flight at once.
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function properName(name) {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function resolveGen3Types(pokemon) {
  const current = pokemon.types.map((t) => t.type.name);
  const pastEntries = (pokemon.past_types || [])
    .map((p) => ({ gen: GEN_ORDER[p.generation.name], types: p.types.map((t) => t.type.name) }))
    .filter((p) => p.gen >= TARGET_GEN)
    .sort((a, b) => a.gen - b.gen);
  return pastEntries.length > 0 ? pastEntries[0].types : current;
}

function describeEvolutionDetail(detail, toName) {
  const parts = [];
  switch (detail.trigger?.name) {
    case "level-up":
      if (detail.min_level) parts.push(`Level ${detail.min_level}`);
      else if (detail.min_happiness) parts.push(`High friendship${detail.time_of_day ? ` (${detail.time_of_day})` : ""}`);
      else if (detail.known_move_type) parts.push(`Level up knowing a ${properName(detail.known_move_type.name)}-type move`);
      else parts.push("Level up (special condition)");
      break;
    case "trade":
      parts.push(detail.held_item ? `Trade holding ${properName(detail.held_item.name)}` : "Trade");
      break;
    case "use-item":
      parts.push(detail.item ? `Use ${properName(detail.item.name)}` : "Use item");
      break;
    default:
      parts.push(detail.trigger ? properName(detail.trigger.name) : "Special condition");
  }
  if (detail.min_happiness && detail.trigger?.name !== "level-up") parts.push(`friendship ${detail.min_happiness}+`);
  if (detail.location) parts.push(`at ${properName(detail.location.name)}`);
  return `${parts.join(", ")} → ${toName}`;
}

// Walks an evolution-chain tree, emitting one entry per node containing
// what that species evolves INTO (each with a human-readable note).
function collectEvolutions(node, out) {
  const fromId = idFromUrl(node.species.url);
  const evolutions = node.evolves_to
    .filter((child) => idFromUrl(child.species.url) <= DEX_COUNT) // Kanto Dex scope only
    .map((child) => {
      const toId = idFromUrl(child.species.url);
      const toName = properName(child.species.name);
      const details = child.evolution_details.length > 0 ? child.evolution_details : [{ trigger: null }];
      return {
        toId,
        toName,
        minLevel: details[0].min_level ?? null,
        notes: details.map((d) => describeEvolutionDetail(d, toName)),
      };
    });
  out.set(fromId, evolutions);
  for (const child of node.evolves_to) collectEvolutions(child, out);
}

// Ranks the best of a Pokemon's level-up + TM/HM moves for FireRed/LeafGreen.
// Same-type (STAB) moves are prioritized first (they deal 1.5x damage in-game),
// then raw power, with a minimum-accuracy cutoff so unreliable moves (e.g. sub-75%
// accuracy) don't get recommended over safer options when better ones exist.
// Excluded outright: these deal damage but faint the user, so no in-game guide
// actually recommends them as a Pokemon's "best attack".
const SELF_KO_MOVES = new Set(["explosion", "self-destruct"]);
// Hidden Power's real type/power is set per-Pokemon by hidden IVs in-game;
// PokeAPI only exposes a placeholder (Normal/60), which would misleadingly
// show up as "STAB" here, so it's excluded rather than shown as fact.
const VARIABLE_MOVES = new Set(["hidden-power"]);

function rankBestAttacks(levelUpMoves, machineMoves, moveDetails, ownTypes) {
  const byName = new Map();
  for (const m of levelUpMoves) byName.set(m.name, { name: m.name, level: m.level, method: "level-up" });
  for (const m of machineMoves) if (!byName.has(m.name)) byName.set(m.name, { name: m.name, level: null, method: "machine" });

  const damaging = [...byName.values()]
    .map((m) => ({ ...m, detail: moveDetails.get(m.name) }))
    .filter(
      (m) => m.detail && m.detail.power != null && !SELF_KO_MOVES.has(m.name) && !VARIABLE_MOVES.has(m.name)
    )
    .map((m) => ({
      name: properName(m.name),
      type: m.detail.type,
      power: m.detail.power,
      accuracy: m.detail.accuracy,
      damageClass: m.detail.damageClass,
      level: m.level,
      method: m.method,
      stab: ownTypes.includes(m.detail.type),
      reliable: m.detail.accuracy == null || m.detail.accuracy >= 75,
    }));

  damaging.sort((a, b) => {
    if (a.reliable !== b.reliable) return a.reliable ? -1 : 1;
    if (a.stab !== b.stab) return a.stab ? -1 : 1;
    if (b.power !== a.power) return b.power - a.power;
    if (a.method !== b.method) return a.method === "level-up" ? -1 : 1;
    return (a.level ?? 0) - (b.level ?? 0);
  });

  const top = damaging.slice(0, 4).map((move) => {
    const source = move.method === "machine" ? "TM/HM" : `learned at level ${move.level}`;
    return {
      name: move.name,
      type: move.type,
      power: move.power,
      damageClass: move.damageClass,
      reason: move.stab ? `STAB • ${move.power} power, ${source}` : `${move.power} power, ${source}`,
    };
  });
  return top;
}

function computeMatchups(ownTypes, typeRelations) {
  const multiplier = Object.fromEntries(ALL_TYPES.map((t) => [t, 1]));
  for (const ownType of ownTypes) {
    const rel = typeRelations.get(ownType);
    if (!rel) continue;
    for (const t of rel.double) multiplier[t] *= 2;
    for (const t of rel.half) multiplier[t] *= 0.5;
    for (const t of rel.none) multiplier[t] *= 0;
  }
  const weaknesses = [];
  const resistances = [];
  const immunities = [];
  for (const [type, mult] of Object.entries(multiplier)) {
    if (mult === 0) immunities.push(type);
    else if (mult > 1) weaknesses.push(type);
    else if (mult < 1) resistances.push(type);
  }
  return { weaknesses, resistances, immunities };
}

async function main() {
  const ids = Array.from({ length: DEX_COUNT }, (_, i) => i + 1);

  console.log("Fetching type damage relations...");
  const typeJsons = await mapLimit(ALL_TYPES, 6, (name) => cachedFetch(`${BASE}/type/${name}`));
  const typeRelations = new Map(
    typeJsons.map((t) => [
      t.name,
      {
        double: t.damage_relations.double_damage_from.map((d) => d.name),
        half: t.damage_relations.half_damage_from.map((d) => d.name),
        none: t.damage_relations.no_damage_from.map((d) => d.name),
      },
    ])
  );

  console.log(`Fetching ${DEX_COUNT} pokemon + species...`);
  const pokemonList = await mapLimit(ids, 6, (id) => cachedFetch(`${BASE}/pokemon/${id}`));
  const speciesList = await mapLimit(ids, 6, (id) => cachedFetch(`${BASE}/pokemon-species/${id}`));

  console.log("Fetching evolution chains...");
  const chainUrls = [...new Set(speciesList.map((s) => s.evolution_chain.url))];
  const chains = await mapLimit(chainUrls, 6, (url) => cachedFetch(url));
  const evolutionsBySpeciesId = new Map();
  for (const chain of chains) collectEvolutions(chain.chain, evolutionsBySpeciesId);
  // Only within-scope parents count: a few Kanto Pokemon (Pikachu, Clefairy...)
  // have a Gen II "baby" pre-evolution (Pichu, Cleffa...) outside the Kanto Dex,
  // which would otherwise leave evolvesFromId pointing at a nonexistent entry.
  const evolvesFromId = new Map();
  for (const [fromId, evolutions] of evolutionsBySpeciesId) {
    if (fromId > DEX_COUNT) continue;
    for (const evo of evolutions) evolvesFromId.set(evo.toId, fromId);
  }

  console.log("Collecting FireRed/LeafGreen level-up movepools...");
  const levelUpMovesByPokemon = pokemonList.map((p) =>
    p.moves
      .map((m) => {
        const vgd = m.version_group_details.find(
          (d) => d.version_group.name === VERSION_GROUP && d.move_learn_method.name === "level-up"
        );
        return vgd ? { name: m.move.name, level: vgd.level_learned_at } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.level - b.level)
  );

  // TM/HM-taught moves are what most community "best moveset" guides actually lean
  // on for coverage (Earthquake, Ice Beam, etc.) — pulled in for ranking purposes,
  // separate from the level-up table so that stays a straightforward reference.
  console.log("Collecting FireRed/LeafGreen TM/HM movepools...");
  const machineMovesByPokemon = pokemonList.map((p) =>
    p.moves
      .map((m) => {
        const learnsByMachine = m.version_group_details.some(
          (d) => d.version_group.name === VERSION_GROUP && d.move_learn_method.name === "machine"
        );
        return learnsByMachine ? { name: m.move.name } : null;
      })
      .filter(Boolean)
  );

  const allMoveNames = [
    ...new Set([...levelUpMovesByPokemon.flat(), ...machineMovesByPokemon.flat()].map((m) => m.name)),
  ];
  console.log(`Fetching details for ${allMoveNames.length} unique moves...`);
  const moveJsons = await mapLimit(allMoveNames, 6, (name) => cachedFetch(`${BASE}/move/${name}`));
  const moveDetails = new Map(
    moveJsons.map((m) => [
      m.name,
      {
        type: m.type.name,
        power: m.power,
        accuracy: m.accuracy,
        pp: m.pp,
        // Status moves have no physical/special category in any generation;
        // everything else is reclassified to the Gen III type-based split.
        damageClass:
          m.damage_class.name === "status" ? "status" : GEN3_DAMAGE_CLASS_BY_TYPE[m.type.name],
      },
    ])
  );

  console.log("Assembling final dataset...");
  const result = pokemonList.map((p, i) => {
    const species = speciesList[i];
    const types = resolveGen3Types(p);
    const matchups = computeMatchups(types, typeRelations);
    const levelUpMoves = levelUpMovesByPokemon[i].map((m) => ({
      level: m.level,
      name: properName(m.name),
      ...moveDetails.get(m.name),
    }));
    const flavorFor = (version) =>
      species.flavor_text_entries
        .find((f) => f.language.name === "en" && f.version.name === version)
        ?.flavor_text.replace(/[\n\f­]+/g, " ") ?? null;

    return {
      id: p.id,
      name: properName(p.name),
      // The actual in-game FireRed/LeafGreen battle sprite (falls back to other
      // Gen III sprites, then modern artwork, for the rare case one is missing).
      sprite:
        p.sprites.versions?.["generation-iii"]?.["firered-leafgreen"]?.front_default ??
        p.sprites.versions?.["generation-iii"]?.["emerald"]?.front_default ??
        p.sprites.other?.["official-artwork"]?.front_default ??
        p.sprites.front_default,
      types,
      stats: Object.fromEntries(p.stats.map((s) => [s.stat.name, s.base_stat])),
      genus: species.genera.find((g) => g.language.name === "en")?.genus ?? "",
      flavorText: { firered: flavorFor("firered"), leafgreen: flavorFor("leafgreen") },
      weaknesses: matchups.weaknesses,
      resistances: matchups.resistances,
      immunities: matchups.immunities,
      evolvesFromId: evolvesFromId.get(p.id) ?? null,
      evolutions: evolutionsBySpeciesId.get(p.id) ?? [],
      levelUpMoves,
      bestAttacks: rankBestAttacks(levelUpMovesByPokemon[i], machineMovesByPokemon[i], moveDetails, types),
    };
  });

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(result, null, 2));
  console.log(`Wrote ${result.length} entries to ${path.relative(process.cwd(), OUT_FILE)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
