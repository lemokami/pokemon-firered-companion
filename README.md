# FireRed Companion

A personal companion site for playing Pokémon FireRed: a Kanto Pokédex (#1–151, grouped by
evolution family) with evolutions, where to find each Pokémon, FireRed-accurate level-up movepools,
recommended attacks, type matchup tips, a progressive recommended-team builder, and a general
game-tips page.

**Live at [lemokami.github.io/pokemon-firered-companion](https://lemokami.github.io/pokemon-firered-companion/)**
— auto-deployed by [a GitHub Actions workflow](.github/workflows/deploy.yml) on every push to `main`.

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
- Move power/accuracy/PP/type are resolved to their Gen III values via PokeAPI's `past_values`, not the
  current top-level fields (which reflect the latest generation). About a fifth of all moves used here
  have changed since Gen III — e.g. Flamethrower/Thunderbolt/Ice Beam were 95 power (now 90), Knock Off
  was 20 power (now 65), Karate Chop was Normal-type before Gen II.
- Evolutions are scoped to the Kanto Dex — later-gen branches (e.g. Eevee's Espeon/Leafeon/etc.) are
  excluded since they aren't part of this dex.
- "Recommended attacks" ranks each Pokémon's damaging level-up and TM/HM moves by same-type bonus
  (STAB) first, then power, excluding self-KO moves and Hidden Power (whose real type/power is set by
  each Pokémon's IVs, not a fixed value).
- "Where to Find" pulls real FireRed/LeafGreen encounter data (wild routes, fishing rods, gifts,
  fossils, trades, Game Corner) from PokeAPI's per-Pokémon encounters endpoint, excluding methods that
  aren't actually playing the game (e.g. a Japan-only Pokémon Colosseum bonus-disc distribution).
- The Recommended Teams page is hand-curated but cross-checked against the same location data and
  verified item/NPC acquisition points, not just recalled from memory. Its "team level" hint per gym is
  set a few levels above that gym's own strongest Pokémon (verified trainer data), not guessed.

## Build

```bash
npm run build
```

Outputs a static site to `dist/`. Deployed automatically to GitHub Pages by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `main` — no manual step
needed. `vite.config.js`'s `base` and the `<BrowserRouter basename>` in `src/main.jsx` are set to
`/pokemon-firered-companion/` to match where GitHub Pages serves this repo; `public/404.html` plus a
small inline script in `index.html` work around GitHub Pages having no server-side rewrite for
client-side routes, so deep links and refreshes on e.g. `/pokedex/25` work correctly.
