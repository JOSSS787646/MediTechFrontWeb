import api from "../Api/index";

// Método que permite validar el login de un usuario, recibe 2 parámetros
export const login = async (nombre: string, contrasenia: string) => {
  try {
    const response = await api.post("/Usuario/login", { nombre, contrasenia });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al iniciar sesión");
  }
};
