import axios from "axios";

const API_URL = "https://localhost:5239/api/Cita";

// ========================================
// 🔹 Crear una nueva cita
// ========================================
export const createCita = async (citaData: CreateCitaDto, token: string) => {
  try {
    const response = await axios.post(`${API_URL}`, citaData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Cita creada:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al crear la cita:", error);
    throw error.response?.data || error.message;
  }
};

// ========================================
// 🔹 Obtener las citas del paciente autenticado
// ========================================
export const getMisCitas = async (token: string) => {
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

// ========================================
// 🔹 Obtener una cita por su ID
// ========================================
export const getCitaById = async (id: number, token: string) => {
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

// ========================================
// 🧩 Tipado de datos
// ========================================
export interface CreateCitaDto {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  fechaNacimiento: string; // formato ISO: "YYYY-MM-DD"
  horaCita: string;        // "HH:mm"
  especialidad: string;
  medico: string;
  sede: string;
  motivo: string;
}
