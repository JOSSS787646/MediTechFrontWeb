import React, { useState, useEffect } from "react";
import styles from "../../styles/Components/SendGmailModal.module.css";
import { enviarRecetaPorCorreo } from "../../Api/recetas";

const ModalEnvioCorreo = ({ 
  formData, 
  onClose, 
  emailPaciente, 
  setEmailPaciente,
  pdfBlob,
  pdfUrl 
}) => {
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [vistaPreviaCargada, setVistaPreviaCargada] = useState(false);

  // Cargar vista previa del PDF cuando el modal se abre
  useEffect(() => {
    if (pdfUrl) {
      setVistaPreviaCargada(true);
      console.log("✅ Vista previa del PDF cargada");
    }
  }, [pdfUrl]);

  const handleEnviarCorreo = async () => {
    if (!emailPaciente) {
      setMensaje("❌ Por favor ingresa un email válido");
      return;
    }

    if (!pdfBlob) {
      setMensaje("❌ No se pudo generar el PDF para enviar");
      return;
    }

    console.log("📧 Enviando receta por correo a:", emailPaciente);
    setEnviando(true);
    setMensaje("");

    try {
      const resultado = await enviarRecetaPorCorreo({
        email: emailPaciente,
        datosReceta: formData,
        pdfBlob: pdfBlob
      });

      console.log("✅ Correo enviado exitosamente:", resultado);
      setMensaje("✅ Receta enviada por correo exitosamente");
      
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error("❌ Error enviando correo:", error);
      setMensaje("❌ Error al enviar la receta por correo");
    } finally {
      setEnviando(false);
    }
  };

  const descargarPDF = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receta_${formData.pacienteNombre.replace(/\s+/g, '_')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>
            <span className="material-icons">email</span>
            Enviar Receta por Correo
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* VISTA PREVIA DEL PDF */}
          <div className={styles.previewSection}>
            <div className={styles.previewHeader}>
              <h3>Vista Previa del PDF</h3>
              <button 
                className={styles.downloadBtn}
                onClick={descargarPDF}
                disabled={!pdfBlob}
              >
                <span className="material-icons">download</span>
                Descargar
              </button>
            </div>
            
            {vistaPreviaCargada ? (
              <div className={styles.pdfPreview}>
                <iframe
                  src={pdfUrl}
                  title="Vista previa de la receta"
                  className={styles.pdfIframe}
                />
                <div className={styles.pdfInfo}>
                  <span className="material-icons">picture_as_pdf</span>
                  PDF generado automáticamente - {formData.pacienteNombre}
                </div>
              </div>
            ) : (
              <div className={styles.pdfCargando}>
                <span className="material-icons">hourglass_empty</span>
                <p>Generando vista previa del PDF...</p>
              </div>
            )}
          </div>

          {/* FORMULARIO DE CORREO */}
          <div className={styles.emailSection}>
            <label htmlFor="emailPaciente">Correo del Paciente:</label>
            <input
              id="emailPaciente"
              type="email"
              value={emailPaciente}
              onChange={(e) => setEmailPaciente(e.target.value)}
              placeholder="ejemplo@correo.com"
              className={styles.emailInput}
            />
            <small>Se enviará el PDF que ves arriba como archivo adjunto</small>
          </div>

          {mensaje && (
            <div className={`${styles.mensaje} ${mensaje.includes('✅') ? styles.exito : styles.error}`}>
              {mensaje}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button 
            className={styles.sendButton}
            onClick={handleEnviarCorreo}
            disabled={enviando || !emailPaciente || !pdfBlob}
          >
            {enviando ? (
              <>
                <span className="material-icons">hourglass_empty</span>
                Enviando...
              </>
            ) : (
              <>
                <span className="material-icons">send</span>
                Enviar Receta por Correo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEnvioCorreo;