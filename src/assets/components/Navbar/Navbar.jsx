import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <span className="navbar-logo">⛩️ KAMIKAZES MG ⛩️</span>

        <button
          className="navbar-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <nav className={`navbar-menu ${open ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>Inicio</Link>
          <Link to="/map" onClick={closeMenu}>Mapa</Link>

          {isAuthenticated && user ? (
            <>
              <span className="navbar-user">
                👤 {user.name}
              </span>

              <button
                className="navbar-logout"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                Salir
              </button>
              <Link to="/events" onClick={closeMenu}>Eventos</Link>
            </>
            
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link
                to="/register"
                className="highlight"
                onClick={closeMenu}
              >
                Registro
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
