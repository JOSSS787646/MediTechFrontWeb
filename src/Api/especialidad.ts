import api from "./index";

export interface Especialidad {
  id: number;
  nombre: string;
}

export const getEspecialidades = async (): Promise<Especialidad[]> => {
  try {
    // GET api/Especialidad/activas
    const response = await api.get("/Especialidad/activas");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al obtener las especialidades"
    );
  }
};
