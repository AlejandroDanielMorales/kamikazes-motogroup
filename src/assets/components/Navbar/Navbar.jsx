import { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <span className="navbar-logo">⛩️KAMIKAZES MG⛩️</span>

        <button
          className="navbar-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <nav className={`navbar-menu ${open ? "open" : ""}`}>
          <Link to="/">Inicio</Link>
          <Link to="/map">Mapa</Link>
          <Link to="/login">Login</Link>
          <Link to="/register" className="highlight">
            Registro
          </Link>
        </nav>
      </div>
    </header>
  );
}
