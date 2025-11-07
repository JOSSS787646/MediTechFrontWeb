import React, { createContext, useState, useEffect } from "react";
import { getToken, saveToken, clearToken, isTokenValid } from "../utils/tokenUtils";

interface AuthContextType {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isCheckingAuth: true,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (token && isTokenValid(token)) {
      setIsAuthenticated(true);
    } else {
      clearToken();
      setIsAuthenticated(false);
    }

    setIsCheckingAuth(false);
  }, []);

  const login = (token: string) => {
    saveToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isCheckingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
