# FireRed Companion

A personal companion site for playing Pokémon FireRed/LeafGreen: a Kanto Pokédex (#1–151, grouped by
evolution family) with evolutions, where to find each Pokémon, FireRed-accurate level-up movepools,
recommended attacks, type matchup tips, a progressive recommended-team builder, and a general
game-tips page.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Data

Pokémon data lives in [`src/data/pokemon.json`](src/data/pokemon.json), pre-built from the public
[PokeAPI](https://pokeapi.co) by [`scripts/build-data.mjs`](scripts/build-data.mjs). It's already
generated and committed, so you don't need to run it — but if you want to regenerate it (e.g. after
tweaking the "best attacks" logic):

```bash
npm run fetch-data
```

This re-fetches all 151 Pokémon, their species/evolution/encounter data, every FireRed/LeafGreen
level-up and TM/HM move, and type damage relations, caching raw responses in `scripts/.cache/` so
reruns are fast.

Notable accuracy details baked into the pipeline:
- Movepools are filtered to the `firered-leafgreen` version group.
- Typing is resolved to what it was in Generation III (e.g. Clefairy is Normal, not Fairy).
- Move categories are reclassified to the Gen I–III type-based physical/special split (PokeAPI reports
  the modern per-move split, e.g. it lists Dark-type moves as Physical, which wasn't true pre-Gen IV).
- Evolutions are scoped to the Kanto Dex — later-gen branches (e.g. Eevee's Espeon/Leafeon/etc.) are
  excluded since they aren't part of this dex.
- "Recommended attacks" ranks each Pokémon's damaging level-up and TM/HM moves by same-type bonus
  (STAB) first, then power, excluding self-KO moves and Hidden Power (whose real type/power is set by
  each Pokémon's IVs, not a fixed value).
- "Where to Find" pulls real FireRed/LeafGreen encounter data (wild routes, fishing rods, gifts,
  fossils, trades, Game Corner) from PokeAPI's per-Pokémon encounters endpoint.
- The Recommended Teams page is hand-curated but cross-checked against the same location data and
  verified item/NPC acquisition points, not just recalled from memory.

## Build

```bash
npm run build
```

Outputs a static site to `dist/`, deployable anywhere (GitHub Pages, Netlify, Vercel, etc.).
