import axios from "axios";

const API_URL = "https://localhost:44389/api/Paciente";

// ✅ Obtener todos los pacientes
export const getPacientes = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener los pacientes:", error);
    throw new Error("Error al obtener los pacientes");
  }
};

// ✅ Obtener un paciente por ID
export const getPacienteById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener el paciente:", error);
    throw new Error("Error al obtener el paciente");
  }
};

// ✅ Obtener un paciente por CURP
export const getPacienteByCurp = async (curp: string) => {
  try {
    const response = await axios.get(`${API_URL}/curp/${curp}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener el paciente por CURP:", error);
    throw new Error("Error al obtener el paciente");
  }
};

// ✅ Crear un nuevo paciente
export const addPaciente = async (pacienteData: any) => {
  try {
    console.log("📤 Enviando datos al backend:", pacienteData);
    const response = await axios.post(`${API_URL}/agregar`, pacienteData);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al agregar el paciente:", error);
    throw new Error("Error al agregar el paciente");
  }
};

// ✅ Actualizar un paciente existente (corrigido)
export const updatePaciente = async (id: number, pacienteData: any) => {
  try {
    console.log(`📤 Actualizando paciente ${id}:`, pacienteData);

    // 🔹 Convertir a PascalCase (para C#)
    const payload: any = {};
    for (const key in pacienteData) {
      const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
      payload[pascalKey] = pacienteData[key];
    }

    console.log("📦 Payload enviado al backend:", payload);

    const response = await axios.put(`${API_URL}/actualizar/${id}`, payload);
    return response.status; // 204 si fue exitoso
  } catch (error: any) {
    console.error("❌ Error al actualizar el paciente:", error.response || error);
    throw new Error("Error al actualizar el paciente");
  }
};

// ✅ Eliminar un paciente
export const deletePaciente = async (id: number) => {
  try {
    console.log(`🗑️ Eliminando paciente ${id}`);
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.status === 204;
  } catch (error: any) {
    console.error("❌ Error al eliminar el paciente:", error);
    throw new Error("Error al eliminar el paciente");
  }
};

// ✅ Login de paciente (por CURP o Email)
export const loginPaciente = async (credentials: {
  curpOrEmail: string;
  contrasenia: string;
}) => {
  try {
    console.log("📤 Iniciando sesión paciente:", credentials);
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data; // Token JWT
  } catch (error: any) {
    console.error("❌ Error en el login del paciente:", error);
    throw new Error("Error en el login del paciente");
  }
};

// ✅ Recuperar contraseña por teléfono
export const recuperarContraseniaPorTelefono = async (telefono: string) => {
  try {
    console.log("📤 Enviando solicitud de recuperación:", telefono);
    const response = await axios.post(`${API_URL}/recuperar-contrasenia`, {
      telefono,
    });
    return response.data; // { Mensaje, CodigoTemporal }
  } catch (error: any) {
    console.error("❌ Error al recuperar contraseña:", error);
    throw new Error("Error al recuperar contraseña");
  }
};
