// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

// Create the context object
const AuthContext = createContext(null);

// Provider component that wraps the app
export function AuthProvider({ children }) {
  // token and user state
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  // Save token & user to localStorage when changed
  useEffect(() => {
    if (token) localStorage.setItem("token", token); else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user)); else localStorage.removeItem("user");
  }, [user]);

  // login helper: accepts token and user object
  const login = ({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setUser(newUser);
  };

  // logout helper
  const logout = () => {
    setToken("");
    setUser(null);
  };

  // expose values and helpers
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// convenience hook
export function useAuth() {
  return useContext(AuthContext);
}
