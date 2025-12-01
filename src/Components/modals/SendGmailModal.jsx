import React, { useState, useEffect } from "react";
import styles from "../../styles/Components/SendGmailModal.module.css";
import { enviarRecetaPorCorreo, createReceta } from "../../Api/recetas";
import Swal from "sweetalert2";

const ModalEnvioCorreo = ({
  formData,
  onClose,
  emailPaciente,
  setEmailPaciente,
  pdfBlob,
  pdfUrl,
}) => {
  const [enviando, setEnviando] = useState(false);
  const [vistaPreviaCargada, setVistaPreviaCargada] = useState(false);

  useEffect(() => {
    if (pdfUrl) setVistaPreviaCargada(true);
  }, [pdfUrl]);

  const handleEnviarCorreo = async () => {
    console.log("📌 formData recibido en ModalEnvioCorreo:", formData);

    // Validar correo
    if (!emailPaciente || !emailPaciente.includes("@")) {
      Swal.fire("Correo inválido", "Ingresa un correo válido.", "error");
      return;
    }

    // Validar PDF
    if (!pdfBlob) {
      Swal.fire("Error", "No hay PDF para enviar.", "error");
      return;
    }

    // Validar IDs necesarios
    if (!formData.pacienteId || !formData.doctorId || !formData.idSignosVitales) {
      console.error("❌ Faltan IDs requeridos:", {
        pacienteId: formData.pacienteId,
        doctorId: formData.doctorId,
        idSignosVitales: formData.idSignosVitales,
      });

      Swal.fire(
        "Error",
        "Faltan datos para guardar la receta (Paciente, Doctor o Signos Vitales).",
        "error"
      );
      return;
    }

    // 🔥 IMPORTANTE: usar los nombres EXACTOS del DTO CreateRecetaDto
    const payload = {
      ID_Paciente: formData.pacienteId,
      ID_Doctor: formData.doctorId,
      Tratamientos: formData.tratamiento,
      ID_SignosVitales: formData.idSignosVitales,
      
    };

    console.log("📤 Payload que se enviará a createReceta:", payload);

    try {
      setEnviando(true);

      // 1️⃣ Guardar receta en BD
      console.log("💾 Llamando a createReceta...");
      const resReceta = await createReceta(payload);
      console.log("✅ Respuesta de createReceta:", resReceta);

      // 2️⃣ Enviar por correo
      console.log("📧 Llamando a enviarRecetaPorCorreo...");
      const resCorreo = await enviarRecetaPorCorreo({
        email: emailPaciente,
        pdfBlob,
      });
      console.log("✅ Respuesta de enviarRecetaPorCorreo:", resCorreo);

      // 3️⃣ Cerrar modal
      onClose();

      // 4️⃣ Notificación al usuario
      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Receta enviada",
          text: "La receta se guardó correctamente y se envió al correo del paciente.",
          timer: 2200,
          showConfirmButton: false,
        });
      }, 200);
    } catch (error) {
      console.error("❌ ERROR en guardar/enviar receta:", error);

      onClose();

      setTimeout(() => {
        Swal.fire(
          "Error",
          "No se pudo guardar o enviar la receta. Revisa la consola para más detalles.",
          "error"
        );
      }, 200);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>
            <span className="material-icons">email</span>
            Enviar Receta
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.previewSection}>
            <h3>Vista Previa</h3>
            {vistaPreviaCargada ? (
              <iframe className={styles.pdfIframe} src={pdfUrl} />
            ) : (
              <p>Cargando PDF...</p>
            )}
          </div>

          <div className={styles.emailSection}>
            <label>Correo del paciente</label>
            <input
              type="email"
              value={emailPaciente}
              onChange={(e) => setEmailPaciente(e.target.value)}
              placeholder="ejemplo@correo.com"
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>

          <button
            className={styles.sendButton}
            onClick={handleEnviarCorreo}
            disabled={enviando}
          >
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEnvioCorreo;
