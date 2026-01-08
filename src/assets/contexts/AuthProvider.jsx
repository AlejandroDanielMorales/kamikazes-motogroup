import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token;

  const login = async (email, password) => {
    try {
      setLoading(true);

      // 1️⃣ Login
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const newToken = res.data.token;

      // 2️⃣ Guardar token
      localStorage.setItem("token", newToken);
      setToken(newToken);

      // 3️⃣ Traer perfil
      const profile = await axios.get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });

      setUser(profile.data);
    } catch (error) {
        console.error("Error en login", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
