import { NavLink } from "react-router-dom";

export default function TabNav() {
  return (
    <header className="app-header">
      <div className="app-title">
        <span className="app-title-fire">Fire</span>
        <span className="app-title-red">Red</span>
        <span className="app-title-sub">Companion</span>
      </div>
      <nav className="tab-nav">
        <NavLink to="/pokedex" className={({ isActive }) => (isActive ? "tab active" : "tab")}>
          Pokédex
        </NavLink>
        <NavLink to="/teams" className={({ isActive }) => (isActive ? "tab active" : "tab")}>
          Teams
        </NavLink>
        <NavLink to="/tips" className={({ isActive }) => (isActive ? "tab active" : "tab")}>
          General Tips
        </NavLink>
      </nav>
    </header>
  );
}
