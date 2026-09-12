const GYMS = [
  { city: "Pewter City", leader: "Brock", type: "rock" },
  { city: "Cerulean City", leader: "Misty", type: "water" },
  { city: "Vermilion City", leader: "Lt. Surge", type: "electric" },
  { city: "Celadon City", leader: "Erika", type: "grass" },
  { city: "Fuchsia City", leader: "Koga", type: "poison" },
  { city: "Saffron City", leader: "Sabrina", type: "psychic" },
  { city: "Cinnabar Island", leader: "Blaine", type: "fire" },
  { city: "Viridian City", leader: "Giovanni", type: "ground" },
];

const ELITE_FOUR = [
  { name: "Lorelei", type: "ice" },
  { name: "Bruno", type: "fighting" },
  { name: "Agatha", type: "ghost" },
  { name: "Lance", type: "dragon" },
  { name: "Champion (Rival)", type: null },
];

export default function GeneralTips() {
  return (
    <div className="tips-page">
      <section className="panel tips-panel">
        <h2>Choosing Your Starter</h2>
        <p>
          <strong>Bulbasaur</strong> is the easiest starter for a first playthrough: Grass/Poison is
          super effective against both of the first two gyms (Brock's Rock-types and Misty's
          Water-types). <strong>Squirtle</strong> also crushes Brock and coasts through most of the
          early game. <strong>Charmander</strong> is the hardest early on — weak to Brock's Rock-types
          — but becomes very strong mid-to-late game once it evolves and learns Fire/Flying coverage.
        </p>
        <p className="panel-hint">
          Going Charmander anyway? Grind it to level 13 before the Pewter Gym — it learns the Steel-type
          move Metal Claw, which is super effective against Brock's Rock-types and evens the fight out.
        </p>
      </section>

      <section className="panel tips-panel">
        <h2>Gym Leaders, In Order</h2>
        <ol className="tips-list">
          {GYMS.map((g, i) => (
            <li key={g.city}>
              <strong>
                {i + 1}. {g.city}
              </strong>{" "}
              — {g.leader} ({g.type})
            </li>
          ))}
        </ol>
        <p className="panel-hint">
          Check each Pokémon's page for its type weaknesses to plan who to bring to a given gym.
        </p>
      </section>

      <section className="panel tips-panel">
        <h2>Elite Four &amp; Champion</h2>
        <ol className="tips-list">
          {ELITE_FOUR.map((e, i) => (
            <li key={e.name}>
              <strong>
                {i + 1}. {e.name}
              </strong>
              {e.type ? ` (${e.type})` : ""}
            </li>
          ))}
        </ol>
        <p className="panel-hint">
          Your rival closes out the Champion match with a full team based on the starter you picked —
          bring balanced coverage, not just one strong Pokémon.
        </p>
      </section>

      <section className="panel tips-panel">
        <h2>HMs You'll Need</h2>
        <ul className="tips-list">
          <li>
            <strong>Cut</strong> — clears small trees blocking paths; needed fairly early to progress
            past Route 2.
          </li>
          <li>
            <strong>Flash</strong> — lights up dark caves, most notably Rock Tunnel.
          </li>
          <li>
            <strong>Rock Smash</strong> — breaks cracked boulders, opens shortcuts and encounters.
          </li>
          <li>
            <strong>Strength</strong> — pushes boulders for puzzles, required in Team Rocket's Hideout
            area and beyond.
          </li>
          <li>
            <strong>Surf</strong> — required for most water routes and several Sevii Islands.
          </li>
          <li>
            <strong>Fly</strong> — instant travel between discovered towns once earned.
          </li>
          <li>
            <strong>Waterfall</strong> — needed late-game/post-game to reach certain Sevii Islands areas.
          </li>
        </ul>
        <p className="panel-hint">
          Keep a dedicated "HM slave" in your party (a Pokémon that can learn several HMs) so you don't
          have to overwrite your main team's moves.
        </p>
      </section>

      <section className="panel tips-panel">
        <h2>Don't Miss These</h2>
        <ul className="tips-list">
          <li>The Bike Voucher from a sailor in Vermilion City lets you get a Bike in Cerulean City.</li>
          <li>The Itemfinder helps you locate hidden items scattered across routes.</li>
          <li>Old Rod / Good Rod / Super Rod let you fish for Water-types — each is found in a different town.</li>
          <li>The Exp. Share item is invaluable for leveling up newly caught Pokémon without over-training your lead.</li>
          <li>
            Unlike modern games, a <strong>TM in FireRed is consumed the moment you use it</strong> —
            think about which Pokémon really wants it before teaching it (a few, like Rock Smash and
            Dig, can be bought again later).
          </li>
        </ul>
      </section>

      <section className="panel tips-panel">
        <h2>Money-Making: The Nugget Bridge Trick</h2>
        <p>
          After beating your rival and the five trainers on Nugget Bridge (Route 24), save your game
          <em> without</em> talking to the Team Rocket grunt waiting at the end. Go heal up, come back,
          and fight him — he hands you a Nugget and battles you every single time, win or lose, so you
          can rebattle him over and over for as many Nuggets as you want. Each one sells for 5,000₽ at
          any Poké Mart, making this the fastest early-game cash method in the game.
        </p>
      </section>

      <section className="panel tips-panel">
        <h2>Sevii Islands (Post-Game)</h2>
        <p>
          FireRed adds the Sevii Islands, a set of seven islands south of Kanto that open
          up progressively after you help Bill's grandfather and connect the Pokémon Network Center.
          They add extra story content, new areas, and Pokémon from later generations that aren't
          catchable in the main Kanto region — worth exploring once you've beaten (or while finishing)
          the Elite Four.
        </p>
        <p className="panel-hint">
          After the Hall of Fame, one of the three legendary beasts also starts roaming Kanto — which
          one is decided by your starter, always the type with an advantage over it: Bulbasaur brings
          out Entei (Fire), Charmander brings out Suicune (Water), and Squirtle brings out Raikou
          (Electric). Only that one beast is available per save file.
        </p>
      </section>

      <section className="panel tips-panel">
        <h2>General Battle Tips</h2>
        <ul className="tips-list">
          <li>Lowering a wild Pokémon's HP and inflicting Sleep or Paralysis makes it much easier to catch.</li>
          <li>Type advantage matters more than raw level early on — check the weaknesses on each Pokémon's page before a gym fight.</li>
          <li>Avoid over-leveling one Pokémon; a balanced team of 4–6 handles gyms and the Elite Four far better than one overleveled favorite.</li>
          <li>Save before gym battles and the Elite Four — you can't leave the Elite Four run partway through once it starts.</li>
        </ul>
      </section>
    </div>
  );
}
