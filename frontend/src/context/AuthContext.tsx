import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  getToken,
  setToken,
  clearToken,
} from "../services/api";
import type { LoginRequest, RegisterRequest } from "../types/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(getToken() !== null);
  }, []);

  async function login(payload: LoginRequest) {
    const response = await apiLogin(payload);
    setToken(response.token);
    setIsAuthenticated(true);
  }

  async function register(payload: RegisterRequest) {
    const response = await apiRegister(payload);
    setToken(response.token);
    setIsAuthenticated(true);
  }

  function logout() {
    clearToken();
    setIsAuthenticated(false);
  }

  const value: AuthContextValue = { isAuthenticated, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}