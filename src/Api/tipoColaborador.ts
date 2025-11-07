import api from "./index";

export interface TipoColaborador {
  id: number;
  nombre: string;
}

export const getTiposColaboradores = async (): Promise<TipoColaborador[]> => {
  try {
    // GET api/TipoColaborador
    const response = await api.get("/TipoColaborador");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Error al obtener los tipos de colaborador"
    );
  }
};
