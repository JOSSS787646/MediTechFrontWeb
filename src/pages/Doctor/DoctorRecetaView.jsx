import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SidebarMenu from "../../Components/SidebarMenu";
import { SidebarDoctor } from "../../Config/sidebars";
import styles from "../../styles/pages/DoctorRecetaView.module.css";
import logo from "../../assets/logoLargo.png";
import "material-icons/iconfont/material-icons.css";

import { getPacienteByCurp } from "../../Api/paciente";
import { getColaboradorById, getColaboradorByCurp } from "../../Api/colaborator";
import { verificarRolUsuario } from "../../Api/rol";
import { getSignosVitalesByPacienteId } from "../../Api/signosVitales";

import {
  generarRecetaPDFSimple,
  descargarRecetaPDF,
} from "../../utils/PdfGenerator";

import ModalEnvioCorreo from "../../Components/modals/SendGmailModal";

const Iconos = {
  medico: "medical_services",
  paciente: "person",
  signos: "monitor_heart",
  tratamiento: "vaccines",
  guardar: "picture_as_pdf",
  correo: "mail",
  usuario: "account_circle",
  reloj: "schedule",
  calendario: "calendar_today",
};

export default function DoctorRecetaView() {
  const location = useLocation();

  const [horaActual, setHoraActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");
  const [usuario, setUsuario] = useState(null);

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  const [emailPaciente, setEmailPaciente] = useState("");

  // 🔥 AGREGADO → IDs necesarios para guardar receta
  const [formData, setFormData] = useState({
    doctorNombre: "",
    doctorCedula: "",
    doctorTelefono: "",
    doctorEmail: "",
    doctorId: null,            // NUEVO ✔

    pacienteNombre: "",
    pacienteEdad: "",
    pacienteNacimiento: "",
    pacienteTelefono: "",
    pacienteAlergias: "",
    pacienteId: null,          // NUEVO ✔

    temperatura: "",
    presion: "",
    estatura: "",
    idSignosVitales: null,     // NUEVO ✔

    tratamiento: "",
  });

  /* ===========================================================
      Cargar datos del doctor
     =========================================================== */
  useEffect(() => {
    const cargarDatosDoctor = async () => {
      try {
        const usuarioLS = JSON.parse(localStorage.getItem("usuario"));
        if (!usuarioLS) return;

        setUsuario(usuarioLS);

        const rolData = await verificarRolUsuario(usuarioLS.id);

        if (!rolData?.colaborador?.curp) {
          setMensaje("❌ No se encontró colaborador asignado");
          return;
        }

        const curp = rolData.colaborador.curp;

        const colaboradorReal = await getColaboradorByCurp(curp);
        const doctor = await getColaboradorById(colaboradorReal.id);

        // ✔ Se agrega doctorId SIN quitar nada
        setFormData((prev) => ({
          ...prev,
          doctorNombre: `${doctor.nombre} ${doctor.apellidoPaterno ?? ""} ${doctor.apellidoMaterno ?? ""}`.trim(),
          doctorCedula: doctor.matriculaProfesional ?? "",
          doctorTelefono: doctor.telefono ?? "",
          doctorEmail: doctor.email ?? "",
          doctorId: doctor.id, // ✔ NUEVO
        }));
      } catch {
        setMensaje("❌ Error cargando datos del doctor");
      }
    };

    cargarDatosDoctor();
  }, []);

  /* ===========================================================
      Reloj
     =========================================================== */
  useEffect(() => {
    const int = setInterval(() => {
      const now = new Date();

      setHoraActual(
        now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
      );
      setFechaActual(
        now.toLocaleDateString("es-MX", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }, 1000);

    return () => clearInterval(int);
  }, []);

  /* ===========================================================
      Cargar datos del paciente
     =========================================================== */
  useEffect(() => {
    if (location.state?.pacienteData) {
      cargarDatosPaciente(location.state.pacienteData);
    }
  }, [location]);

  const cargarDatosPaciente = async (data) => {
    try {
      setCargando(true);

      const paciente = await getPacienteByCurp(data.curp);
      const pacienteId = paciente.id;

      const fecha = paciente.fechaNacimiento
        ? paciente.fechaNacimiento.split("T")[0]
        : "";

      // ✔ Se agrega pacienteId SIN quitar nada
      setFormData((prev) => ({
        ...prev,
        pacienteNombre: `${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`,
        pacienteEdad: data.edad ?? "",
        pacienteNacimiento: fecha,
        pacienteTelefono: paciente.telefono ?? "",
        pacienteAlergias: "Sin alergias registradas",
        pacienteId, // ✔ NUEVO
      }));

      // SIGNOS VITALES
      const signos = await getSignosVitalesByPacienteId(pacienteId);

      if (Array.isArray(signos) && signos.length > 0) {
        const ultimo = signos.sort(
          (a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
        )[0];

        // ✔ Se agrega idSignosVitales SIN quitar nada
        setFormData((prev) => ({
          ...prev,
          temperatura: ultimo.temperatura?.toString() ?? "",
          presion: ultimo.presion ?? "",
          estatura: ultimo.estatura?.toString() ?? "",
          pacienteAlergias: ultimo.alergias ?? "Sin alergias registradas",
          idSignosVitales: ultimo.idSignosVitales
        }));

        setMensaje("🩺 Signos vitales más recientes cargados");
      } else {
        setMensaje("⚠️ El paciente no tiene signos vitales registrados");
      }
    } catch {
      setMensaje("❌ Error cargando datos del paciente");
    } finally {
      setCargando(false);
    }
  };

  /* ===========================================================
      Input handler
     =========================================================== */
  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ===========================================================
      Generar PDF
     =========================================================== */
  const generarPDF = async () => {
    try {
      setCargando(true);
      await descargarRecetaPDF(formData);
      setMensaje("✅ PDF generado correctamente");
    } catch {
      setMensaje("❌ Error generando PDF");
    } finally {
      setCargando(false);
    }
  };

  /* ===========================================================
      Generar PDF para correo + abrir modal
     =========================================================== */
  const abrirModalCorreo = async () => {
    try {
      setCargando(true);

      const blob = await generarRecetaPDFSimple(formData, "blob");
      const url = await generarRecetaPDFSimple(formData, "url");

      setPdfBlob(blob);
      setPdfUrl(url);
      setMostrarModalCorreo(true);
    } catch {
      setMensaje("❌ Error preparando PDF para correo");
    } finally {
      setCargando(false);
    }
  };

  /* ===========================================================
      JSX Render
     =========================================================== */
  return (
    <div className={styles.mainLayout}>
      <SidebarMenu opcionesCustom={SidebarDoctor} />

      <div className={styles.contentArea}>
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.logoBox}>
            <img src={logo} className={styles.logo} />
          </div>

          <div className={styles.userInfo}>
            <span className={styles.userName}>
              <span className="material-icons">{Iconos.usuario}</span>
              {usuario?.nombreUsuario ?? "Doctor"}
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

        <div className={styles.scrollContainer}>
          <div className={styles.mainContent}>
            {mensaje && <div className={styles.mensaje}>{mensaje}</div>}

            {/* FORM ORIGINAL – no elimino nada */}
            <form className={styles.compactForm}>

              {/* MÉDICO */}
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                  <span className="material-icons">{Iconos.medico}</span>
                  Datos del Médico
                </h2>

                <div className={styles.gridForm}>
                  <div className={styles.inputGroup}>
                    <label>Nombre Completo</label>
                    <input
                      name="doctorNombre"
                      value={formData.doctorNombre}
                      onChange={handleInput}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Cédula Profesional</label>
                    <input
                      name="doctorCedula"
                      value={formData.doctorCedula}
                      onChange={handleInput}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Teléfono</label>
                    <input
                      name="doctorTelefono"
                      value={formData.doctorTelefono}
                      onChange={handleInput}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input
                      name="doctorEmail"
                      value={formData.doctorEmail}
                      onChange={handleInput}
                    />
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
                    <input
                      name="pacienteNombre"
                      value={formData.pacienteNombre}
                      onChange={handleInput}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Edad</label>
                    <input
                      name="pacienteEdad"
                      value={formData.pacienteEdad}
                      onChange={handleInput}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Fecha Nacimiento</label>
                    <input
                      type="date"
                      name="pacienteNacimiento"
                      value={formData.pacienteNacimiento}
                      onChange={handleInput}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Teléfono</label>
                    <input
                      name="pacienteTelefono"
                      value={formData.pacienteTelefono}
                      onChange={handleInput}
                    />
                  </div>

                  <div className={styles.inputGroupFull}>
                    <label>Alergias</label>
                    <input
                      name="pacienteAlergias"
                      value={formData.pacienteAlergias}
                      onChange={handleInput}
                    />
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
                    <label>Temperatura</label>
                    <input
                      name="temperatura"
                      value={formData.temperatura}
                      onChange={handleInput}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Presión</label>
                    <input
                      name="presion"
                      value={formData.presion}
                      onChange={handleInput}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Estatura</label>
                    <input
                      name="estatura"
                      value={formData.estatura}
                      onChange={handleInput}
                    />
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
                    rows="6"
                    value={formData.tratamiento}
                    onChange={handleInput}
                  ></textarea>
                </div>
              </div>
            </form>

            {/* BOTONES */}
            <div className={styles.actionBar}>
              <button className={styles.saveBtn} onClick={generarPDF}>
                <span className="material-icons">{Iconos.guardar}</span>
                Descargar Receta
              </button>

              <button className={styles.emailBtn} onClick={abrirModalCorreo}>
                <span className="material-icons">{Iconos.correo}</span>
                Enviar por Correo
              </button>
            </div>

            {/* MODAL */}
            {mostrarModalCorreo && (
              <ModalEnvioCorreo
                formData={formData}
                pdfBlob={pdfBlob}
                pdfUrl={pdfUrl}
                emailPaciente={emailPaciente}
                setEmailPaciente={setEmailPaciente}
                onClose={() => setMostrarModalCorreo(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
