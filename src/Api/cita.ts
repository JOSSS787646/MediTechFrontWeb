import axios from "axios";

const API_URL = "https://localhost:5239/api/Cita";

// ========================================
// 🟢 Crear una cita SIN autenticación (endpoint público)
// POST: /api/Cita/publico
// ========================================
export const createCita = async (citaData: any) => {
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

    console.log("✅ Cita creada (publica):", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al crear cita pública:", error);
    console.error("❌ Detalles:", error.response?.data);
    throw error.response?.data || error.message;
  }
};

// ========================================
// 🟢 Obtener todas las citas de un paciente (SIN token)
// GET: /api/Cita/mis-citas/publico?pacienteId=1
// ========================================
export const getMisCitasPublicas = async (pacienteId: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/mis-citas/publico?pacienteId=${pacienteId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener citas públicas:", error);
    throw error.response?.data || error.message;
  }
};

// ========================================
// 🟢 Obtener una cita por ID pública
// GET: /api/Cita/publico/{id}
// ========================================
export const getCitaByIdPublica = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/publico/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error al obtener cita pública ID ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

// ========================================
// 🟢 Obtener citas de un colaborador SIN token
// GET: /api/Cita/colaborador/publico/{colaboradorId}
// ========================================
export const getCitasDeColaboradorPublico = async (
  colaboradorId: number
) => {
  try {
    const response = await axios.get(
      `${API_URL}/colaborador/publico/${colaboradorId}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `❌ Error al obtener citas públicas del colaborador ${colaboradorId}:`,
      error
    );
    throw error.response?.data || error.message;
  }
};