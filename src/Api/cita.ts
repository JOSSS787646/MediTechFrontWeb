import axios from "axios";

const API_URL = "https://localhost:44389/api/Cita";

// =========================================================
// 🔹 Crear una nueva cita
// =========================================================
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

// =========================================================
// 🔹 Obtener las citas del paciente autenticado
// =========================================================
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

// =========================================================
// 🔹 Obtener una cita por ID
// =========================================================
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

// =========================================================
// 🔹 Obtener citas de un colaborador (Doctor / Médico)
// =========================================================
// ⚠️ Aquí NO uso ningún método raro ni URL incorrecta.
// ⚠️ Sólo uso tu misma estructura: /colaborador/{id}
export const getCitasDeColaborador = async (colaboradorId: number, token: string) => {
  if (!colaboradorId) {
    console.warn("⚠️ No se proporcionó ID de colaborador.");
    throw "El ID del colaborador no puede ser null o undefined.";
  }

  try {
    const response = await axios.get(`${API_URL}/colaborador/${colaboradorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📌 Citas del colaborador:", response.data);
    return response.data;

  } catch (error: any) {
    console.error(`❌ Error al obtener citas del colaborador ${colaboradorId}:`, error);
    throw error.response?.data || error.message;
  }
};

// =========================================================
// 🔹 Tipado
// =========================================================
export interface CreateCitaDto {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  fechaNacimiento: string; // "YYYY-MM-DD"
  horaCita: string;        // "HH:mm"
  especialidad: string;
  medico: string;
  sede: string;
  motivo: string;
}
