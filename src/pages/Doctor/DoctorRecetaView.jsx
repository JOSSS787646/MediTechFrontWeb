// DoctorRecetaView.jsx
import React, { useState, useEffect } from "react";
import SidebarMenu from "../../Components/SidebarMenu";
import { SidebarDoctor } from "../../Config/sidebars";
import styles from "../../styles/pages/DoctorRecetaView.module.css";
import logo from "../../assets/logoLargo.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "material-icons/iconfont/material-icons.css";

// Iconos de Material Icons
const Iconos = {
  medico: "medical_services",
  paciente: "person",
  signos: "monitor_heart",
  tratamiento: "vaccines",
  guardar: "picture_as_pdf",
  usuario: "account_circle",
  reloj: "schedule",
  calendario: "calendar_today",
  buscar: "search",
  cerrar: "close",
  descargar: "download",
  vista: "visibility"
};

export default function DoctorRecetaView() {
  const [horaActual, setHoraActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");
  const [usuario, setUsuario] = useState(null);

  const [formData, setFormData] = useState({
    doctorNombre: "",
    doctorCedula: "",
    doctorTelefono: "",
    doctorEmail: "",
    pacienteNombre: "",
    pacienteEdad: "",
    pacienteNacimiento: "",
    pacienteTelefono: "",
    pacienteAlergias: "",
    temperatura: "",
    presion: "",
    estatura: "",
    tratamiento: "",
  });

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [mostrarPreview, setMostrarPreview] = useState(false);

  // ===========================
  // CARGAR USUARIO ACTUAL
  // ===========================
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuario"));
    if (u) {
      setUsuario(u);
      setFormData((prev) => ({
        ...prev,
        doctorNombre: `${u.nombre} ${u.apellidoPaterno || ""}`,
        doctorCedula: u.cedula || "",
        doctorTelefono: u.telefono || "",
        doctorEmail: u.email || "",
      }));
    }
  }, []);

  // ===========================
  // RELOJ
  // ===========================
  useEffect(() => {
    const int = setInterval(() => {
      const now = new Date();

      setHoraActual(
        now.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      const f = now.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      setFechaActual(f.charAt(0).toUpperCase() + f.slice(1));
    }, 1000);

    return () => clearInterval(int);
  }, []);

  // ===========================
  // HANDLER DE INPUTS
  // ===========================
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ===========================
  // FUNCIONES PARA PDF
  // ===========================
  const safe = (str) => {
    return str ? String(str) : "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // ===========================
  // GENERAR VISTA PREVIA PDF
  // ===========================
  const generarVistaPreviaPDF = async () => {
    const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #333;
            line-height: 1.4;
          }
          .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 4px solid #63b2a5;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .logo {
            width: 70px;
            height: 70px;
            object-fit: contain;
          }
          .doctor-info h1 {
            font-size: 22px;
            color: #63b2a5;
            margin: 0;
          }
          .section-title {
            font-size: 18px;
            margin-top: 25px;
            color: #63b2a5;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 5px;
          }
          .data-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px 20px;
            margin-top: 10px;
          }
          .field {
            width: 45%;
          }
          .rx-symbol {
            font-size: 70px;
            color: #63b2a5;
            margin: 25px 0;
            text-align: center;
            opacity: 0.7;
          }
          .box {
            background: #F8FAFC;
            padding: 20px;
            border-left: 4px solid #63b2a5;
            margin-top: 10px;
            white-space: pre-wrap;
            border-radius: 0 8px 8px 0;
            line-height: 1.6;
          }
          .footer {
            margin-top: 40px;
            padding: 15px;
            background: #63b2a5;
            color: white;
            text-align: center;
            border-radius: 6px;
            font-size: 14px;
          }
          .field strong {
            color: #555;
          }
        </style>
      </head>

      <body>

        <!-- Encabezado con logo + info médico -->
        <div class="header">
          <div style="display: flex; align-items: center; gap: 15px;">
            <div style="width: 70px; height: 70px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
              <span style="font-size: 24px;">🏥</span>
            </div>
            <div class="doctor-info">
              <h1>${safe(formData.doctorNombre)}</h1>
              <div>Médico General</div>
              <div>Cédula: ${safe(formData.doctorCedula)}</div>
            </div>
          </div>

          <div style="text-align: right; font-size: 13px;">
            Tel: ${safe(formData.doctorTelefono)}<br>
            Email: ${safe(formData.doctorEmail)}
          </div>
        </div>

        <!-- Datos del Paciente -->
        <div class="section-title">Datos del Paciente</div>
        <div class="data-grid">
          <div class="field"><strong>Paciente:</strong> ${safe(formData.pacienteNombre)}</div>
          <div class="field"><strong>Edad:</strong> ${safe(formData.pacienteEdad)} años</div>
          <div class="field"><strong>Fecha Nac.:</strong> ${formatDate(formData.pacienteNacimiento)}</div>
          <div class="field"><strong>Teléfono:</strong> ${safe(formData.pacienteTelefono)}</div>
          <div class="field"><strong>Alergias:</strong> ${safe(formData.pacienteAlergias) || "Ninguna registrada"}</div>
          <div class="field"><strong>Fecha de Receta:</strong> ${formatDate(new Date().toISOString())}</div>
        </div>

        <!-- Signos Vitales -->
        <div class="section-title">Signos Vitales</div>
        <div class="data-grid">
          <div class="field"><strong>Temperatura:</strong> ${safe(formData.temperatura) || "N/A"}°C</div>
          <div class="field"><strong>Presión:</strong> ${safe(formData.presion) || "N/A"}</div>
          <div class="field"><strong>Estatura:</strong> ${safe(formData.estatura) || "N/A"} cm</div>
        </div>

        <!-- RX -->
        <div class="rx-symbol">℞</div>

        <!-- Tratamiento -->
        <div class="section-title">Tratamiento</div>
        <div class="box">${safe(formData.tratamiento) || "No se ha especificado tratamiento."}</div>

        <!-- Footer -->
        <div class="footer">
          <div><strong>${safe(formData.doctorNombre)}</strong> - Médico General</div>
          <div>Cédula: ${safe(formData.doctorCedula)} | Tel: ${safe(formData.doctorTelefono)} | Email: ${safe(formData.doctorEmail)}</div>
        </div>

      </body>
    </html>
    `;

    // Crear blob del HTML
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setPdfPreviewUrl(url);
    setMostrarPreview(true);
  };

  // ===========================
  // GENERAR PDF DESCARGABLE
  // ===========================
  const generarPDFDescargable = async () => {
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 30px; color: #333; line-height: 1.4;">
        <!-- Contenido del PDF igual al preview -->
        ${document.querySelector('.pdfPreviewContent')?.innerHTML || ''}
      </div>
    `;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "letter");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`receta-${formData.pacienteNombre || 'paciente'}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className={styles.mainLayout}>
      <SidebarMenu opcionesCustom={SidebarDoctor} />

      <div className={styles.contentArea}>
        {/* ======= HEADER COMPACTO ======= */}
        <header className={styles.header}>
          <div className={styles.logoBox}>
            <img src={logo} alt="Logo" className={styles.logo} />
          </div>

          <div className={styles.userInfo}>
            <span className={styles.userName}>
              <span className="material-icons">{Iconos.usuario}</span>
              {usuario?.nombreUsuario || "Doctor"}
            </span>
            <div className={styles.timeInfo}>
              <span className={styles.time}>
                <span className="material-icons">{Iconos.reloj}</span>
                {horaActual}
              </span>
              <span className={styles.date}>
                <span className="material-icons">{Iconos.calendario}</span>
                {fechaActual}
              </span>
            </div>
          </div>
        </header>

        {/* ======= CONTENIDO PRINCIPAL CON SCROLL ======= */}
        <div className={styles.scrollContainer}>
          <div className={styles.mainContent}>
            
            {/* ======= FORMULARIO COMPACTO ======= */}
            <form className={styles.compactForm}>
              
              {/* SECCIÓN MÉDICO Y PACIENTE EN GRID */}
              <div className={styles.doubleSection}>
                {/* MÉDICO */}
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>
                    <span className="material-icons">{Iconos.medico}</span>
                    Datos del Médico
                  </h2>
                  <div className={styles.gridForm}>
                    <div className={styles.inputGroup}>
                      <label>Nombre Completo</label>
                      <input type="text" name="doctorNombre" value={formData.doctorNombre} onChange={handleInput} />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Cédula Profesional</label>
                      <input type="text" name="doctorCedula" value={formData.doctorCedula} onChange={handleInput} />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Teléfono</label>
                      <input type="text" name="doctorTelefono" value={formData.doctorTelefono} onChange={handleInput} />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Email</label>
                      <input type="email" name="doctorEmail" value={formData.doctorEmail} onChange={handleInput} />
                    </div>
                  </div>
                </div>

                {/* PACIENTE */}
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>
                    <span className="material-icons">{Iconos.paciente}</span>
                    Datos del Paciente
                  </h2>
                  <div className={styles.gridForm}>
                    <div className={styles.inputGroup}>
                      <label>Nombre Completo</label>
                      <input type="text" name="pacienteNombre" value={formData.pacienteNombre} onChange={handleInput} />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Edad</label>
                      <input type="number" name="pacienteEdad" value={formData.pacienteEdad} onChange={handleInput} />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Fecha Nacimiento</label>
                      <input type="date" name="pacienteNacimiento" value={formData.pacienteNacimiento} onChange={handleInput} />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Teléfono</label>
                      <input type="text" name="pacienteTelefono" value={formData.pacienteTelefono} onChange={handleInput} />
                    </div>

                    <div className={styles.inputGroupFull}>
                      <label>Alergias Conocidas</label>
                      <input type="text" name="pacienteAlergias" value={formData.pacienteAlergias} onChange={handleInput} placeholder="Lista de alergias o condiciones relevantes" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SIGNOS VITALES */}
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                  <span className="material-icons">{Iconos.signos}</span>
                  Signos Vitales
                </h2>
                <div className={styles.vitalsGrid}>
                  <div className={styles.inputGroup}>
                    <label>Temperatura (°C)</label>
                    <input type="text" name="temperatura" value={formData.temperatura} onChange={handleInput} placeholder="Ej: 36.5" />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Presión Arterial</label>
                    <input type="text" name="presion" value={formData.presion} onChange={handleInput} placeholder="Ej: 120/80" />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Estatura (cm)</label>
                    <input type="text" name="estatura" value={formData.estatura} onChange={handleInput} placeholder="Ej: 170" />
                  </div>
                </div>
              </div>

              {/* TRATAMIENTO */}
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                  <span className="material-icons">{Iconos.tratamiento}</span>
                  Tratamiento
                </h2>
                <div className={styles.inputGroup}>
                  <label>Descripción del Tratamiento</label>
                  <textarea
                    name="tratamiento"
                    value={formData.tratamiento}
                    onChange={handleInput}
                    placeholder="Describa el tratamiento completo, incluyendo medicamentos, dosis, frecuencia, duración, recomendaciones, etc."
                    rows="6"
                  ></textarea>
                </div>
              </div>

            </form>

            {/* ======= BOTONES DE ACCIÓN ======= */}
            <div className={styles.actionBar}>
              <button 
                className={styles.previewBtn} 
                onClick={generarVistaPreviaPDF}
                disabled={!formData.pacienteNombre}
              >
                <span className="material-icons">{Iconos.vista}</span>
                Vista Previa PDF
              </button>
              
              <button 
                className={styles.saveBtn} 
                onClick={generarPDFDescargable}
                disabled={!formData.pacienteNombre}
              >
                <span className="material-icons">{Iconos.guardar}</span>
                Descargar Receta
              </button>
            </div>

            {/* ======= VISTA PREVIA PDF ======= */}
            {mostrarPreview && pdfPreviewUrl && (
              <div className={styles.pdfPreview}>
                <div className={styles.previewHeader}>
                  <h2 className={styles.previewTitle}>
                    <span className="material-icons">{Iconos.vista}</span>
                    Vista Previa de la Receta
                  </h2>
                  <button 
                    className={styles.closePreview} 
                    onClick={() => setMostrarPreview(false)}
                  >
                    <span className="material-icons">{Iconos.cerrar}</span>
                  </button>
                </div>
                
                <div className={styles.previewContainer}>
                  <iframe
                    src={pdfPreviewUrl}
                    width="100%"
                    height="600px"
                    className={styles.previewFrame}
                    title="Vista previa de la receta médica"
                  />
                </div>
                
                <div className={styles.previewActions}>
                  <button 
                    className={styles.downloadBtn}
                    onClick={generarPDFDescargable}
                  >
                    <span className="material-icons">{Iconos.descargar}</span>
                    Descargar PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}