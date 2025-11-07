import api from "./index";

export interface Modulo {
  id: number;
  nombre: string;
}

export const getModulos = async (): Promise<Modulo[]> => {
  try {
    // GET api/Modulo/GetAll
    const response = await api.get("/Modulo/GetAll");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al obtener los módulos"
    );
  }
};
