// DoctorRecetaView.jsx
import React, { useState, useEffect } from "react";
import SidebarMenu from "../../Components/SidebarMenu";
import { SidebarDoctor } from "../../Config/sidebars";
import styles from "../../styles/pages/DoctorRecetaView.module.css";
import logo from "../../assets/logoLargo.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DoctorRecetaView() {
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

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuario"));
    if (u) {
      setFormData((prev) => ({
        ...prev,
        doctorNombre: `${u.nombre} ${u.apellidoPaterno || ""}`,
        doctorCedula: u.cedula || "",
        doctorTelefono: u.telefono || "",
        doctorEmail: u.email || "",
      }));
    }
  }, []);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================================
  // GENERAR PDF EXACTO A LA VISTA PREVIA
  // ==========================================
  const generarPdfEnPantalla = async () => {
    const receta = document.getElementById("recetaPreview");
    const logoEl = document.querySelector(`.${styles.pdfLogo}`);

    // Remover miniatura
    receta.classList.remove(styles.recetaPreviewMini);
    logoEl.classList.remove(styles.pdfLogoMini);

    await new Promise((res) => setTimeout(res, 150));

    const canvas = await html2canvas(receta, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    // Restaurar miniatura
    receta.classList.add(styles.recetaPreviewMini);
    logoEl.classList.add(styles.pdfLogoMini);

    const pdf = new jsPDF("p", "mm", "letter");
    const pdfWidth = 215;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    setPdfPreviewUrl(pdfUrl);
  };

  return (
    <div className={styles.mainLayout}>
      <SidebarMenu opcionesCustom={SidebarDoctor} />

      <div className={styles.contentArea}>
        <h1 className={styles.title}>Generar Receta Médica</h1>

        {/* FORMULARIO */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Datos del Médico</h2>
          <div className={styles.grid2}>
            <input type="text" name="doctorNombre" placeholder="Nombre" value={formData.doctorNombre} onChange={handleInput} />
            <input type="text" name="doctorCedula" placeholder="Cédula" value={formData.doctorCedula} onChange={handleInput} />
            <input type="text" name="doctorTelefono" placeholder="Teléfono" value={formData.doctorTelefono} onChange={handleInput} />
            <input type="email" name="doctorEmail" placeholder="Email" value={formData.doctorEmail} onChange={handleInput} />
          </div>

          <h2 className={styles.sectionTitle}>Datos del Paciente</h2>
          <div className={styles.grid2}>
            <input type="text" name="pacienteNombre" placeholder="Nombre" value={formData.pacienteNombre} onChange={handleInput} />
            <input type="number" name="pacienteEdad" placeholder="Edad" value={formData.pacienteEdad} onChange={handleInput} />
            <input type="date" name="pacienteNacimiento" value={formData.pacienteNacimiento} onChange={handleInput} />
            <input type="text" name="pacienteTelefono" placeholder="Teléfono" value={formData.pacienteTelefono} onChange={handleInput} />
            <input type="text" name="pacienteAlergias" placeholder="Alergias" value={formData.pacienteAlergias} onChange={handleInput} />
          </div>

          <h2 className={styles.sectionTitle}>Signos Vitales</h2>
          <div className={styles.grid3}>
            <input type="text" name="temperatura" placeholder="Temperatura" value={formData.temperatura} onChange={handleInput} />
            <input type="text" name="presion" placeholder="Presión" value={formData.presion} onChange={handleInput} />
            <input type="text" name="estatura" placeholder="Estatura" value={formData.estatura} onChange={handleInput} />
          </div>

          <h2 className={styles.sectionTitle}>Tratamiento</h2>
          <textarea
            className={styles.textarea}
            name="tratamiento"
            rows="5"
            placeholder="Escribe la receta..."
            value={formData.tratamiento}
            onChange={handleInput}
          />

          <button className={styles.generateBtn} onClick={generarPdfEnPantalla}>
            <span className="material-icons">send</span>
            Guardar y mandar receta
          </button>
        </div>

        {/* ==========================================
            PREVIEW HTML BASE PARA PDF
        ========================================== */}
        <div id="recetaPreview" className={`${styles.recetaPreview} ${styles.recetaPreviewMini}`}>
          
          <div className={styles.recetaHeader}>
            <div className={styles.recetaDoctor}>
              <img src={logo} className={`${styles.pdfLogo} ${styles.pdfLogoMini}`} alt="logo" />
              <div>
                <h2>{formData.doctorNombre || "Médico"}</h2>
                <p>Médico General</p>
                <p>Cédula: {formData.doctorCedula}</p>
              </div>
            </div>

            <div className={styles.recetaDoctorInfo}>
              <p>Tel: {formData.doctorTelefono}</p>
              <p>Email: {formData.doctorEmail}</p>
            </div>
          </div>

          <h3 className={styles.previewTitle}>Datos del Paciente</h3>
          <div className={styles.previewGrid2}>
            <p><strong>Paciente:</strong> {formData.pacienteNombre}</p>
            <p><strong>Edad:</strong> {formData.pacienteEdad}</p>
            <p><strong>Fecha Nac.:</strong> {formData.pacienteNacimiento}</p>
            <p><strong>Teléfono:</strong> {formData.pacienteTelefono}</p>
            <p><strong>Alergias:</strong> {formData.pacienteAlergias}</p>
            <p><strong>Fecha de Receta:</strong> {new Date().toLocaleDateString()}</p>
          </div>

          <h3 className={styles.previewTitle}>Signos Vitales</h3>
          <div className={styles.previewGrid3}>
            <p><strong>Temperatura:</strong> {formData.temperatura}°C</p>
            <p><strong>Presión:</strong> {formData.presion}</p>
            <p><strong>Estatura:</strong> {formData.estatura} cm</p>
          </div>

          {/* MARCA DE AGUA */}
          <div className={styles.watermark}></div>

          <h3 className={styles.previewTitle}>Tratamiento</h3>
          <div className={styles.tratamientoBox}>{formData.tratamiento}</div>

          <div className={styles.footer}>
            <strong>{formData.doctorNombre}</strong>
            <p>Tel: {formData.doctorTelefono} — Email: {formData.doctorEmail}</p>
          </div>
        </div>

        {/* ==========================================
            VISOR PDF
        ========================================== */}
        {pdfPreviewUrl && (
          <div style={{ marginTop: "2rem" }}>
            <h2>Vista previa del PDF generado</h2>
            <iframe
              src={pdfPreviewUrl}
              width="100%"
              height="700px"
              style={{ border: "1px solid #ccc", borderRadius: "10px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
