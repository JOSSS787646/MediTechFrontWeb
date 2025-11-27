import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

/**
 * Obtiene el token almacenado en localStorage.
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Guarda el token en localStorage.
 */
export const saveToken = (token: string): void => {
  localStorage.setItem("token", token);
};

/**
 * Elimina el token del almacenamiento.
 */
export const clearToken = (): void => {
  localStorage.removeItem("token");
};

/**
 * Verifica si el token aún es válido (no expirado).
 */
export const isTokenValid = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const now = Date.now() / 1000; // segundos actuales
    return decoded.exp > now;
  } catch {
    return false;
  }
};
