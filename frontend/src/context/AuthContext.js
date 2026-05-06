import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { authApi } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(() => localStorage.getItem("username") || null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const login = useCallback(async (u, p) => {
    const res = await authApi.login(u, p);
    const t = res.data?.token;
    localStorage.setItem("token", t || "");
    localStorage.setItem("username", u);
    setToken(t || null);
    setUsername(u);
    return res.data;
  }, []);

  const register = useCallback(async (u, p) => {
    await authApi.register(u, p);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("currentScore");
    setToken(null);
    setUsername(null);
  }, []);

  const value = useMemo(
    () => ({ username, token, isAuthenticated: Boolean(username), login, register, logout }),
    [username, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
