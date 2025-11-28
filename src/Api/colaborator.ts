import api from "./index";

// =========================================================
// 🔹 Obtener todos los colaboradores
// =========================================================
export const getColaboradores = async () => {
  try {
    const response = await api.get("/Colaborador");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || "Error al obtener los colaboradores");
  }
};

// =========================================================
// 🔹 Obtener colaborador por ID
// =========================================================
export const getColaboradorById = async (id: number) => {
  try {
    const response = await api.get(`/Colaborador/id/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || `Error al obtener el colaborador con ID ${id}`);
  }
};

// =========================================================
// 🔹 Obtener colaborador por CURP
// =========================================================
export const getColaboradorByCurp = async (curp: string) => {
  try {
    const response = await api.get(`/Colaborador/curp/${curp}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || `Error al obtener colaborador con CURP ${curp}`);
  }
};

// =========================================================
// 🔹 Obtener colaboradores por especialidad
// =========================================================
export const getColaboradoresByEspecialidad = async (idEspecialidad: number) => {
  try {
    const response = await api.get(`/Colaborador/especialidad/${idEspecialidad}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || "Error al obtener colaboradores por especialidad");
  }
};

// =========================================================
// 🔹 Crear colaborador
// =========================================================
export const createColaborador = async (colaborador: any) => {
  try {
    const response = await api.post("/Colaborador", colaborador);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || "Error al crear colaborador");
  }
};

// =========================================================
// 🔹 Actualizar colaborador
// =========================================================
export const updateColaborador = async (id: number, colaborador: any) => {
  try {
    const response = await api.put(`/Colaborador/${id}`, colaborador);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || `Error al actualizar colaborador con ID ${id}`);
  }
};

// =========================================================
// 🔹 Eliminar colaborador
// =========================================================
export const deleteColaborador = async (id: number) => {
  try {
    const response = await api.delete(`/Colaborador/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || `Error al eliminar colaborador con ID ${id}`);
  }
};

// =========================================================
// 🔹 Reactivar colaborador
// =========================================================
export const enableColaborador = async (id: number) => {
  try {
    const response = await api.put(`/Colaborador/reactivar/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || `Error al reactivar colaborador con ID ${id}`);
  }
};

// =========================================================
// 🔹 Obtener citas de un colaborador (RUTA REAL QUE USAS)
// GET https://localhost:44389/api/Colaborador/citas-colaborador/{id}
// =========================================================
export const getCitasDeColaborador = async (idColaborador: number) => {
    try {
        const response = await api.get(`/Colaborador/citas-colaborador/${idColaborador}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error:", error);
        throw error;
    }
};





// =========================================================
// 🔹 Obtener citas de un paciente por CURP o email
// =========================================================
export const getCitasPacienteByCurpOrEmail = async (identificador: string) => {
  try {
    const response = await api.get(`/Colaborador/citas-paciente/${identificador}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || "Error al obtener citas del paciente");
  }
};

// =========================================================
// 🔹 Obtener TODAS las citas de pacientes
// =========================================================
export const getAllCitasPacientes = async () => {
  try {
    const response = await api.get("/Colaborador/todas-las-citas-de-pacientes");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || "Error al obtener todas las citas");
  }
};
