import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand" style={{ textDecoration: "none" }}>
          <span className="brand-mark">SY</span>
          Sahyogi
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/services" className={({ isActive }) => (isActive ? "active" : "")}>
            Services
          </NavLink>
          {user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                Dashboard
              </NavLink>
              <NavLink to="/issues" className={({ isActive }) => (isActive ? "active" : "")}>
                Issues
              </NavLink>
              <NavLink to="/report" className={({ isActive }) => (isActive ? "active" : "")}>
                Report an issue
              </NavLink>
              <NavLink to="/companion" className={({ isActive }) => (isActive ? "active" : "")}>
                AI companion
              </NavLink>
              <NavLink to="/scheme-finder" className={({ isActive }) => (isActive ? "active" : "")}>
                Scheme finder
              </NavLink>
              <NavLink to="/notice-simplifier" className={({ isActive }) => (isActive ? "active" : "")}>
                Notice simplifier
              </NavLink>
            </>
          )}
          {user ? (
            <button onClick={handleLogout}>Log out</button>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                Log in
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
