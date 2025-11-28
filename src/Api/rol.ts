import api from "./index";

/**
 * Estructura exacta del objeto Colaborador que ahora devuelve tu backend
 */
export interface ColaboradorInfo {
  id: number;
  curp: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  telefono: string;
}

/**
 * Estructura del módulo que devuelve el backend
 */
export interface ModuloDisponible {
  id: number;
  nombre: string;
  codigo: string;
}

/**
 * Tipo de respuesta EXACTO del endpoint /Rol/verificar
 */
export interface RolUsuarioResponse {
  usuarioId: number;
  rol: string;
  colaborador: ColaboradorInfo | null;
  modulosDisponibles: ModuloDisponible[];
}

/**
 * GET /api/rol/verificar/{usuarioId}
 */
export const verificarRolUsuario = async (
  usuarioId: number
): Promise<RolUsuarioResponse> => {
  try {
    const response = await api.get(`/Rol/verificar/${usuarioId}`);
    return response.data as RolUsuarioResponse;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.mensaje ||
        "Error al verificar rol del usuario"
    );
  }
};
