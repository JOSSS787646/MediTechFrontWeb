import React, { createContext, useState, useEffect, useContext } from "react";
import { getToken, saveToken, clearToken, isTokenValid } from "../utils/tokenUtils";

// Interface para TypeScript (si estás usando TypeScript)
interface AuthContextType {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  usuario: any;
  login: (token: string, usuarioData?: any) => void;
  logout: () => void;
  hasRole: (rolesPermitidos: string[]) => boolean;
}

// Crear el contexto
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isCheckingAuth: true,
  usuario: null,
  login: () => {},
  logout: () => {},
  hasRole: () => false
});

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = getToken();
    const usuarioGuardado = localStorage.getItem('usuario');

    if (token && isTokenValid(token) && usuarioGuardado) {
      try {
        const usuarioData = JSON.parse(usuarioGuardado);
        setIsAuthenticated(true);
        setUsuario(usuarioData);
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        handleLogout();
      }
    } else {
      handleLogout();
    }

    setIsCheckingAuth(false);
  }, []);

  const login = (token: string, usuarioData = null) => {
    saveToken(token);
    
    if (usuarioData) {
      localStorage.setItem('usuario', JSON.stringify(usuarioData));
      setUsuario(usuarioData);
    }
    
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('usuario');
    setIsAuthenticated(false);
    setUsuario(null);
  };

  const logout = () => {
    handleLogout();
  };

  const hasRole = (rolesPermitidos) => {
    if (!usuario || !usuario.tipoColaborador) return false;
    
    const tipoUsuario = usuario.tipoColaborador.toString().trim().toLowerCase();
    
    return rolesPermitidos.some(rol => {
      const rolNormalizado = rol.toString().trim().toLowerCase();
      
      if (rolNormalizado === tipoUsuario) return true;
      if (rolNormalizado === "1" && (tipoUsuario.includes("médico") || tipoUsuario.includes("medico"))) return true;
      if (rolNormalizado === "2" && tipoUsuario.includes("enfermera")) return true;
      if (rolNormalizado === "3" && (tipoUsuario.includes("admin") || tipoUsuario.includes("administrador"))) return true;
      
      return tipoUsuario.includes(rolNormalizado);
    });
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isCheckingAuth, 
      usuario,
      login, 
      logout,
      hasRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};