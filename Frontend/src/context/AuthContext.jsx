import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("cartika_token")
  );
  const [loading, setLoading] = useState(true);

  // Restore login when application starts
  useEffect(() => {
    const restoreUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
       const response = await api.get("/users/profile");

        setUser(response.data.user);
      } catch (error) {
        console.error("Session restore failed");

        localStorage.removeItem("cartika_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, [token]);

  // Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("cartika_token", token);

    setToken(token);
    setUser(user);

    return response.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("cartika_token");

    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}