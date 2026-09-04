import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Restore user session on initial load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
          }
        } catch (err) {
          console.error("Session restore failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.success && res.data) {
      const { user: userData, token: authToken } = res.data;
      setUser(userData);
      setToken(authToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", authToken);
      return userData;
    }
    throw new Error(res.message || "Login failed");
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success && res.data) {
      const { user: newUser, token: authToken } = res.data;
      setUser(newUser);
      setToken(authToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", authToken);
      return newUser;
    }
    throw new Error(res.message || "Registration failed");
  };

  const logout = async () => {
    try {
      if (token) {
        await authApi.logout();
      }
    } catch {
      // Ignore logout request errors
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Refresh user error:", err);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAdmin: user?.role === "system_admin",
    isStoreOwner: user?.role === "store_owner",
    isNormalUser: user?.role === "normal_user",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
