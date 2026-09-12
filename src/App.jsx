import { Navigate, Route, Routes } from "react-router-dom";
import TabNav from "./components/TabNav";
import PokedexList from "./components/PokedexList";
import PokemonDetail from "./components/PokemonDetail";
import GeneralTips from "./components/GeneralTips";
import RecommendedTeams from "./components/RecommendedTeams";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <TabNav />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/pokedex" replace />} />
          <Route path="/pokedex" element={<PokedexList />} />
          <Route path="/pokedex/:id" element={<PokemonDetail />} />
          <Route path="/teams" element={<RecommendedTeams />} />
          <Route path="/tips" element={<GeneralTips />} />
          <Route path="*" element={<Navigate to="/pokedex" replace />} />
        </Routes>
      </main>
    </div>
  );
}
