// src/Api/recetas.ts
import api from "./index";

export interface CreateRecetaDto {
  id_Paciente: number;
  id_Doctor: number;
  tratamientos: string;
  id_SignosVitales?: number | null;
}

export const createReceta = async (dto: CreateRecetaDto) => {
  try {
    const response = await api.post("/Recetas", dto);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al crear receta:", error);
    throw new Error(error.response?.data || "Error al crear la receta");
  }
};

export const enviarRecetaPorCorreo = async (datos: {
  email: string;
  pdfBlob: Blob;
}) => {
  try {
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
    console.error("❌ Error al enviar correo:", error);
    throw new Error("No se pudo enviar la receta por correo");
  }
};
