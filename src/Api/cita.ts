import axios from "axios";

const API_URL = "http://localhost:5000/api/Cita";

/* =========================================================
   ✔ Tipos de Respuesta del Backend
   (coinciden EXACTAMENTE con CitaVM de C#)
========================================================= */
export interface CitaVM {
  id: number;
  pacienteNombre: string;
  pacienteApellidoPaterno: string;
  pacienteApellidoMaterno: string;
  curp: string;
  fechaNacimiento: string;
  sede: string;
  horaCita: string;
  medico: string;
  especialidad: string;
  motivo: string;
  fechaCita: string;
  idColaborador: number; // 👈 VIENE DEL BACKEND
}

/* =========================================================
   ✔ DTO para crear cita (AUTENTICADO)
   El ID_Paciente viene del JWT en el backend.
========================================================= */
export interface CreateCitaDtoProtegida {
  especialidad: string;
  medico: string;
  sede: string;
  motivo: string;
  fechaCita: string; // YYYY-MM-DD
  horaCita: string;  // HH:mm
}

/* =========================================================
   ✔ DTO para crear cita pública (POST /publico)
   Solo si lo usas. Si no, lo puedes borrar.
========================================================= */
export interface CreateCitaDtoPublica {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  fechaNacimiento: string;
  especialidad: string;
  medico: string;
  sede: string;
  motivo: string;
  fechaCita: string;
  horaCita: string;
}

/* =========================================================
   🔹 Crear cita (AUTENTICADO)
   POST /api/Cita
========================================================= */
export const createCita = async (
  citaData: CreateCitaDtoProtegida,
  token: string
) => {
  try {
    const response = await axios.post(`${API_URL}`, citaData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Error al crear la cita:", error);
    throw error.response?.data || error.message;
  }
};

/* =========================================================
   🔹 Obtener citas del paciente autenticado
   GET /api/Cita/mis-citas
========================================================= */
export const getMisCitas = async (token: string): Promise<CitaVM[]> => {
  try {
    const response = await axios.get(`${API_URL}/mis-citas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener mis citas:", error);
    throw error.response?.data || error.message;
  }
};

export interface CreateCitaDtoPublica {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  fechaNacimiento: string;
  especialidad: string;
  medico: string;
  sede: string;
  motivo: string;
  fechaCita: string;
  horaCita: string;
}

/* =========================================================
   🔹 Crear cita pública (SIN TOKEN)
   POST /api/Cita/publico
========================================================= */
export const createCitaPublica = async (citaData) => {
  try {
    const response = await axios.post(`${API_URL}/publico`, citaData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // Datos devueltos por el backend
  } catch (error: any) {
    console.error("❌ Error al crear cita pública:", error);
    throw error.response?.data || error.message;
  }
};

/* =========================================================
   🔹 Obtener TODAS las citas (ENDPOINT PÚBLICO)
   GET /api/Cita/mis-citas/publico
========================================================= */
export const getAllCitas = async (): Promise<CitaVM[]> => {
  try {
    const response = await axios.get(`${API_URL}/mis-citas/publico`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener todas las citas:", error);
    throw error.response?.data || error.message;
  }
};

/* =========================================================
   🔹 Obtener una cita por ID (AUTENTICADO)
   GET /api/Cita/{id}
========================================================= */
export const getCitaById = async (
  id: number,
  token: string
): Promise<CitaVM> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(`❌ Error al obtener la cita con ID ${id}:`, error);
    throw error.response?.data || error.message;
  }
};
