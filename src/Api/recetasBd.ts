// src/Api/recetas.ts
import api from "./index";

/* ============================================================
   TIPOS (DTOs)
============================================================ */
export interface CreateRecetaDto {
  ID_Paciente: number;
  ID_Doctor: number;
  Tratamientos: string;
  ID_SignosVitales?: number | null;
}

export interface UpdateRecetaDto extends CreateRecetaDto {
  ID: number;
}

export interface RecetaDto {
  id: number;
  id_Paciente: number;
  id_Doctor: number;
  tratamientos: string;
  id_SignosVitales?: number | null;
  fechaCreacion: string;
}

/* ============================================================
   SERVICIO: Obtener todas las recetas
============================================================ */
export const getAllRecetas = async (): Promise<RecetaDto[]> => {
  try {
    const response = await api.get("/Recetas/recetas");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || "Error al obtener las recetas");
  }
};

/* ============================================================
   SERVICIO: Crear una receta
============================================================ */
export const createReceta = async (
  dto: CreateRecetaDto
): Promise<any> => {
  try {
    const response = await api.post("/Recetas", dto);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || "Error al crear la receta");
  }
};

/* ============================================================
   SERVICIO: Actualizar receta
============================================================ */
export const updateReceta = async (
  dto: UpdateRecetaDto
): Promise<string> => {
  try {
    const response = await api.put(`/Recetas/${dto.ID}`, dto);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || "Error al actualizar la receta");
  }
};

/* ============================================================
   SERVICIO: Obtener recetas por paciente
============================================================ */
export const getRecetasByPaciente = async (
  pacienteId: number
): Promise<RecetaDto[]> => {
  try {
    const response = await api.get(`/Recetas/paciente/${pacienteId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Error al obtener recetas del paciente"
    );
  }
};

/* ============================================================
   SERVICIO: Enviar receta PDF por correo
   (usa MULTIPART-FORM-DATA como pide el controller)
============================================================ */
export const enviarRecetaPorCorreo = async (datos: {
  email: string;
  pdfBlob: Blob;
  datosReceta?: any;
}): Promise<any> => {
  try {
    console.log("📧 Enviando receta por correo:", datos);

    const form = new FormData();

    form.append("Correo", datos.email);
    form.append("ArchivoPdf", datos.pdfBlob, "receta.pdf");

    const response = await api.post("/Recetas/enviar-pdf", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Error al enviar receta PDF:", error);
    throw new Error(
      error.response?.data?.mensaje ||
        "No se pudo enviar la receta por correo"
    );
  }
};
