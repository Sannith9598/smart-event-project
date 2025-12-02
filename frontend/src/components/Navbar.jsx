// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  function handleLogout() {
    logout();
    nav("/"); // go to home
  }

  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
      <Link to="/">Home</Link>
      <Link to="/events">Events</Link>

      {user ? (
        <>
          {user.role === "MANAGER" ? <Link to="/manager">Manager</Link> : <Link to="/customer">My Bookings</Link>}
          <span style={{ marginLeft: "auto" }}>
            <strong>{user.name}</strong> ({user.role}) &nbsp;
            <button onClick={handleLogout}>Logout</button>
          </span>
        </>
      ) : (
        <div style={{ marginLeft: "auto" }}>
          <Link to="/login">Login</Link> &nbsp; <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}
