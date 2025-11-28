import api from "./index";

export const enviarRecetaPorCorreo = async (datos) => {
  try {
    console.log("📧 Enviando receta por correo:", datos);

    const form = new FormData();
    form.append("Correo", datos.email);
    form.append("ArchivoPdf", datos.pdfBlob, "receta.pdf");

    const response = await api.post("Recetas/enviar-pdf", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Respuesta del envío:", response.data);
    return response.data;

  } catch (error) {
    console.error("❌ Error enviando receta por correo:", error);
    throw new Error("No se pudo enviar la receta por correo");
  }
};
