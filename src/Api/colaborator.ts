//colaborator.ts
import api from "./index";

// Obtener todos los colaboradores
export const getColaboradores = async () => {
  try {
    const response = await api.get("/Colaborador");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener los colaboradores");
  }
};

// Obtener colaborador por ID
export const getColaboradorById = async (id: number) => {
  try {
    const response = await api.get(`/Colaborador/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Error al obtener el colaborador con ID ${id}`);
  }
};

// Crear nuevo colaborador
export const createColaborador = async (colaborador: any) => {
  try {
    const response = await api.post("/Colaborador", colaborador);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al crear el colaborador");
  }
};

// Actualizar colaborador existente
export const updateColaborador = async (id: number, colaborador: any) => {
  try {
    const response = await api.put(`/Colaborador/${id}`, colaborador);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Error al actualizar el colaborador con ID ${id}`);
  }
};

// Eliminar colaborador por ID
export const deleteColaborador = async (id: number) => {
  try {
    const response = await api.delete(`/Colaborador/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Error al eliminar el colaborador con ID ${id}`);
  }
};
