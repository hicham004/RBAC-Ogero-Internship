// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Signup error:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  const hasPermission = (perm) => {
    if (!user || !user.role || !user.role.permissions) return false;
    return user.role.permissions.some(p => p.name === perm || p === perm);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}
