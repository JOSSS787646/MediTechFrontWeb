import api from "./index";

export interface Cede {
  id: number;
  nombre: string;
}

export const getCedes = async (): Promise<Cede[]> => {
  try {
    // GET api/Cede/GetAll
    const response = await api.get("/Cede/GetAll");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al obtener las cedes"
    );
  }
};
