// src/Api/signosVitales.ts
import api from "./index";

/* ============================================================
   TIPOS (DTOs)
============================================================ */
export interface CreateSignosVitalesDto {
  temperatura: number;
  presion: number;
  estatura: number;
  alergias: string;
  fechaRegistro?: string;

  id_Colaborador: number;
  id_Paciente: number;
}

export interface SignosVitalesUpdateDto extends CreateSignosVitalesDto {
  id: number;
}

export interface SignosVitalesDto {
  id: number;
  temperatura: number;
  presion: number;
  estatura: number;
  alergias: string;
  fechaRegistro: string;
  id_Colaborador: number;
  id_Paciente: number;
}

/* ============================================================
   SERVICIO ESTILO LOGIN.JS
============================================================ */
export const getAllSignosVitales = async (): Promise<SignosVitalesDto[]> => {
  try {
    const response = await api.get("/SignosVitales");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || "Error al obtener los registros");
  }
};

export const createSignosVitales = async (
  dto: CreateSignosVitalesDto
): Promise<string> => {
  try {
    const response = await api.post("/SignosVitales", dto);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || "Error al crear signos vitales");
  }
};

export const updateSignosVitales = async (
  dto: SignosVitalesUpdateDto
): Promise<string> => {
  try {
    const response = await api.put("/SignosVitales", dto);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Error al actualizar signos vitales"
    );
  }
};

export const getSignosVitalesByPacienteId = async (
  pacienteId: number
): Promise<SignosVitalesDto[]> => {
  try {
    const response = await api.get(`/SignosVitales/paciente/${pacienteId}`);
    return response.data;
  } catch (error: any) {
    // 👇 Si el backend responde 404, devolvemos lista vacía (no es error grave)
    if (error.response?.status === 404) {
      return [];
    }

    throw new Error(
      error.response?.data || "Error al obtener signos vitales del paciente"
    );
  }
};

export const getSignosVitalesByPacienteAndFecha = async (
  pacienteId: number,
  fecha: string | Date
): Promise<SignosVitalesDto | null> => {
  try {
    const fechaFormatted =
      typeof fecha === "string" ? fecha : fecha.toISOString();

    const response = await api.get(
      `/SignosVitales/paciente/${pacienteId}/fecha/${fechaFormatted}`
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }

    throw new Error(
      error.response?.data ||
        "Error al obtener los signos vitales por paciente y fecha"
    );
  }
};
