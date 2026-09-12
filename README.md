# FireRed Companion

A personal companion site for playing Pokémon FireRed/LeafGreen: a Kanto Pokédex (#1–151) with
evolutions, FireRed-accurate level-up movepools, recommended attacks, type matchup tips, and a
general game-tips page.

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

This re-fetches all 151 Pokémon, their species/evolution data, every FireRed/LeafGreen level-up move,
and type damage relations, caching raw responses in `scripts/.cache/` so reruns are fast.

Notable accuracy details baked into the pipeline:
- Movepools are filtered to the `firered-leafgreen` version group and `level-up` learn method only.
- Typing is resolved to what it was in Generation III (e.g. Clefairy is Normal, not Fairy).
- Evolutions are scoped to the Kanto Dex — later-gen branches (e.g. Eevee's Espeon/Leafeon/etc.) are
  excluded since they aren't part of this dex.
- "Recommended attacks" ranks each Pokémon's damaging level-up moves by same-type bonus (STAB) first,
  then power, then how early it's learned.

## Build

```bash
npm run build
```

Outputs a static site to `dist/`, deployable anywhere (GitHub Pages, Netlify, Vercel, etc.).
