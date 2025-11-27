import axios from "axios";

const API_URL = "https://localhost:44389/api/Cita";

// =========================================================
// 🔹 Crear una nueva cita
// =========================================================
export const createCita = async (citaData: CreateCitaDto, token: string) => {
  try {
    // ✅ Combinar fecha y hora en formato ISO
    const fechaHoraCompleta = `${citaData.fechaCita}T${citaData.horaCita}:00`;

    // ✅ IMPORTANTE: El backend NO espera un "command", 
    // solo los datos directamente en el body
    const payload = {
      nombre: citaData.nombre,
      apellidoPaterno: citaData.apellidoPaterno,
      apellidoMaterno: citaData.apellidoMaterno,
      curp: citaData.curp,
      fechaNacimiento: citaData.fechaNacimiento, // "YYYY-MM-DD"
      fechaCita: fechaHoraCompleta, // "YYYY-MM-DDTHH:mm:ss"
      horaCita: citaData.horaCita, // "HH:mm"
      especialidad: citaData.especialidad, // Nombre de la especialidad como string
      medico: citaData.medico, // Nombre del médico como string
      sede: citaData.sede, // Dirección de la sede como string
      motivo: citaData.motivo
    };

    console.log("📤 Enviando payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(`${API_URL}/publico`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Cita creada:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("❌ Error al crear cita pública:", error);
    console.error("❌ Detalles:", error.response?.data);
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
    console.error("❌ Error al obtener citas públicas:", error);
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
    console.error(`❌ Error al obtener cita pública ID ${id}:`, error);
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
