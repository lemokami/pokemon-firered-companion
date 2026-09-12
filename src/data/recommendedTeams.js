// Hand-curated, progressive 6-Pokemon roster for a Kanto playthrough, grounded
// in this app's own location/level data (see src/data/pokemon.json) and
// verified acquisition points (Old Rod at Vermilion before Surge, Good/Thunder/
// Moon/Water Stones sold at the Celadon Dept. Store once you reach Celadon,
// etc). Gym order is the standard FireRed route order.
export const PLACES = [
  { id: "pewter", order: 1, name: "Pewter City", leader: "Brock", type: "rock" },
  { id: "cerulean", order: 2, name: "Cerulean City", leader: "Misty", type: "water" },
  { id: "vermilion", order: 3, name: "Vermilion City", leader: "Lt. Surge", type: "electric" },
  { id: "celadon", order: 4, name: "Celadon City", leader: "Erika", type: "grass" },
  { id: "fuchsia", order: 5, name: "Fuchsia City", leader: "Koga", type: "poison" },
  { id: "saffron", order: 6, name: "Saffron City", leader: "Sabrina", type: "psychic" },
  { id: "cinnabar", order: 7, name: "Cinnabar Island", leader: "Blaine", type: "fire" },
  { id: "viridian", order: 8, name: "Viridian City", leader: "Giovanni", type: "ground" },
  { id: "elite-four", order: 9, name: "Elite Four & Champion", leader: null, type: null },
];

// Your starter is the one slot this can't hard-code — pick a line, and every
// checkpoint below shows the right stage of it automatically.
export const STARTERS = {
  bulbasaur: {
    name: "Bulbasaur",
    stages: [
      { atOrder: 1, id: 1 },
      { atOrder: 2, id: 2 },
      { atOrder: 4, id: 3 },
    ],
  },
  charmander: {
    name: "Charmander",
    stages: [
      { atOrder: 1, id: 4 },
      { atOrder: 2, id: 5 },
      { atOrder: 4, id: 6 },
    ],
  },
  squirtle: {
    name: "Squirtle",
    stages: [
      { atOrder: 1, id: 7 },
      { atOrder: 2, id: 8 },
      { atOrder: 4, id: 9 },
    ],
  },
};

export const CORE_SLOTS = [
  {
    id: "flyer",
    role: "Flying all-rounder",
    why: "Route 1, before Pewter even opens up. Great Speed, a good HM mule, and it stays useful all game.",
    stages: [
      { atOrder: 1, id: 16 }, // Pidgey
      { atOrder: 2, id: 17 }, // Pidgeotto - Lv.18
      { atOrder: 5, id: 18 }, // Pidgeot - Lv.36
    ],
  },
  {
    id: "fighter",
    role: "Physical attacker",
    why: "Route 22, right at the start. Fighting coverage this early is rare, and it hits hard all game.",
    stages: [
      { atOrder: 1, id: 56 }, // Mankey
      { atOrder: 4, id: 57 }, // Primeape - Lv.28
    ],
  },
  {
    id: "ground-poison",
    role: "Ground/Poison coverage",
    why: "Route 3, right after Pewter. A second Ground-type helps hugely against Electric, Rock, Fire, and Poison gyms.",
    stages: [
      { atOrder: 2, id: 32 }, // Nidoran (M)
      { atOrder: 2, id: 33 }, // Nidorino - Lv.16
      { atOrder: 4, id: 34 }, // Nidoking - Moon Stone (Celadon Dept. Store)
    ],
  },
  {
    id: "electric",
    role: "Electric coverage",
    why: "A gift Eevee is waiting in the Celadon Mansion — a Thunder Stone (sold right there in Celadon) turns it into one of Kanto's best Electric-types.",
    stages: [
      { atOrder: 4, id: 133 }, // Eevee - gift, Lv.25
      { atOrder: 4, id: 135 }, // Jolteon - Thunder Stone
    ],
  },
  {
    id: "water",
    role: "Water powerhouse",
    why: "The Old Rod (free from the Vermilion fishing guru, before you even fight Surge) only catches Magikarp — but it grows into one of the best all-round Pokémon in Kanto.",
    stages: [
      { atOrder: 3, id: 129 }, // Magikarp
      { atOrder: 4, id: 130 }, // Gyarados - Lv.20
    ],
  },
];

// The Pokemon id representing a slot's stage by the given gym order (or null
// if it hasn't been picked up yet at that point in the game).
export function resolveStage(stages, order) {
  let current = null;
  for (const stage of stages) {
    if (stage.atOrder <= order) current = stage.id;
  }
  return current;
}
