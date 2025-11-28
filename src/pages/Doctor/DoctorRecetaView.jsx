import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SidebarMenu from "../../Components/SidebarMenu";
import { SidebarDoctor } from "../../Config/sidebars";
import styles from "../../styles/pages/DoctorRecetaView.module.css";
import logo from "../../assets/logoLargo.png";
import "material-icons/iconfont/material-icons.css";
import { getPacienteByCurp } from "../../Api/paciente";
import { getColaboradorById } from "../../Api/colaborator";
// CORREGIR LA IMPORTACIÓN - agregar descargarRecetaPDF
import { generarRecetaPDFSimple, descargarRecetaPDF } from "../../utils/PdfGenerator";
import ModalEnvioCorreo from "../../Components/modals/SendGmailModal";

const Iconos = {
  medico: "medical_services",
  paciente: "person",
  signos: "monitor_heart",
  tratamiento: "vaccines",
  guardar: "picture_as_pdf",
  usuario: "account_circle",
  reloj: "schedule",
  calendario: "calendar_today"
};

export default function DoctorRecetaView() {
  const location = useLocation();
  const [horaActual, setHoraActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [emailPaciente, setEmailPaciente] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

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

  // Cargar datos al montar el componente
  useEffect(() => {
    console.log("🚀 DoctorRecetaView iniciado");
    
    // Cargar datos del doctor automáticamente
    cargarDatosDoctor();
    
    // Cargar datos del paciente si se enviaron
    if (location.state?.pacienteData) {
      console.log("📦 Datos del paciente recibidos:", location.state.pacienteData);
      cargarDatosPaciente(location.state.pacienteData);
    } else {
      setMensaje("No se recibieron datos del paciente");
      console.warn("⚠️ No hay datos del paciente");
    }
  }, [location]);

  // Función para cargar datos del doctor desde la API
  const cargarDatosDoctor = async () => {
    try {
      console.log("🔄 Cargando datos del doctor...");
      
      // Obtener usuario del localStorage
      const usuarioData = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioData || !usuarioData.id) {
        console.error("❌ No se encontró ID de usuario en localStorage");
        setMensaje("Error: No se pudo identificar al doctor");
        return;
      }

      console.log("👤 ID del doctor encontrado:", usuarioData.id);
      setUsuario(usuarioData);

      // Llamar a la API para obtener datos completos del doctor
      console.log("📞 Llamando a getColaboradorById...");
      const doctorCompleto = await getColaboradorById(usuarioData.id);
      console.log("✅ Datos completos del doctor recibidos:", doctorCompleto);

      // Actualizar formulario con datos del doctor
      setFormData(prev => ({
        ...prev,
        doctorNombre: `${doctorCompleto.nombre} ${doctorCompleto.apellidoPaterno || ""} ${doctorCompleto.apellidoMaterno || ""}`.trim(),
        doctorCedula: doctorCompleto.matriculaProfesional || "", 
        doctorTelefono: doctorCompleto.telefono || "",
        doctorEmail: doctorCompleto.email || "",
      }));

      console.log("✅ Datos del doctor cargados correctamente");

    } catch (error) {
      console.error("❌ Error cargando datos del doctor:", error);
      setMensaje("❌ Error al cargar datos del doctor");
      
      // Usar datos básicos del localStorage si falla la API
      const usuarioData = JSON.parse(localStorage.getItem("usuario"));
      if (usuarioData) {
        setFormData(prev => ({
          ...prev,
          doctorNombre: usuarioData.nombreUsuario || "Doctor",
        }));
        console.log("🔄 Usando datos básicos del localStorage");
      }
    }
  };

  // Función para formatear fecha para input type="date"
  const formatearFechaParaInput = (fechaString) => {
    if (!fechaString) return "";
    
    console.log("📅 Fecha original:", fechaString);
    
    try {
      const fecha = new Date(fechaString);
      
      if (isNaN(fecha.getTime())) {
        console.error("❌ Fecha inválida:", fechaString);
        return "";
      }
      
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const dia = String(fecha.getDate()).padStart(2, '0');
      
      const fechaFormateada = `${año}-${mes}-${dia}`;
      console.log("✅ Fecha formateada:", fechaFormateada);
      
      return fechaFormateada;
      
    } catch (error) {
      console.error("❌ Error formateando fecha:", error);
      return "";
    }
  };

  // Función para cargar datos del paciente por CURP
  const cargarDatosPaciente = async (pacienteData) => {
    console.log("🔄 Iniciando carga de datos del paciente...");
    
    if (!pacienteData.curp) {
      console.error("❌ No hay CURP proporcionado");
      setMensaje("Error: No se proporcionó CURP del paciente");
      return;
    }

    setCargando(true);
    setMensaje(`Buscando paciente con CURP: ${pacienteData.curp}`);

    try {
      console.log("📞 Llamando a getPacienteByCurp...");
      const pacienteCompleto = await getPacienteByCurp(pacienteData.curp);
      console.log("✅ Datos COMPLETOS del paciente recibidos:", pacienteCompleto);

      const fechaNacimientoFormateada = formatearFechaParaInput(pacienteCompleto.fechaNacimiento);
      console.log("📅 Fecha de nacimiento formateada:", fechaNacimientoFormateada);

      setFormData(prev => ({
        ...prev,
        pacienteNombre: `${pacienteCompleto.nombre} ${pacienteCompleto.apellidoPaterno} ${pacienteCompleto.apellidoMaterno}`,
        pacienteEdad: pacienteCompleto.edad || pacienteData.edad,
        pacienteNacimiento: fechaNacimientoFormateada,
        pacienteTelefono: pacienteCompleto.telefono || pacienteData.telefono,
        pacienteAlergias: "Ninguna alergia registrada"
      }));

      setMensaje("✅ Datos del paciente cargados correctamente");
      console.log("🎉 Formulario actualizado con datos del paciente");

    } catch (error) {
      console.error("❌ Error cargando datos del paciente:", error);
      setMensaje("❌ Error al cargar datos del paciente");
      
      const fechaBasicaFormateada = formatearFechaParaInput(pacienteData.fechaNacimiento);
      
      setFormData(prev => ({
        ...prev,
        pacienteNombre: pacienteData.nombre || "",
        pacienteEdad: pacienteData.edad || "",
        pacienteNacimiento: fechaBasicaFormateada,
        pacienteTelefono: pacienteData.telefono || "",
        pacienteAlergias: "No se pudieron cargar las alergias"
      }));
    } finally {
      setCargando(false);
    }
  };

  // Reloj en tiempo real
  useEffect(() => {
    const actualizarReloj = () => {
      const ahora = new Date();
      setHoraActual(ahora.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second:"2-digit"
      }));
      setFechaActual(ahora.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }));
    };

    actualizarReloj();
    const intervalo = setInterval(actualizarReloj, 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Manejar cambios en los inputs
  const handleInput = (e) => {
    const { name, value } = e.target;
    console.log(`📝 Campo ${name} cambiado:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generar PDF - función actualizada
  const generarPDF = async () => {
    console.log("🔄 Iniciando generación de PDF...");
    setCargando(true);

    try {
      await descargarRecetaPDF(formData); // ← Ahora esta función está importada
      setMensaje("✅ PDF generado correctamente");
      console.log("✅ PDF generado exitosamente");

    } catch (error) {
      console.error("❌ Error generando PDF:", error);
      setMensaje("❌ Error al generar PDF");
    } finally {
      setCargando(false);
    }
  };

  // En la función abrirModalCorreo, cambia a:
const abrirModalCorreo = async () => {
  console.log("📧 Abriendo modal de correo");
  setCargando(true);

  try {
    // Usar la versión simple que es más confiable
    const pdfBlobGenerado = await generarRecetaPDFSimple(formData, 'blob');
    const pdfUrlGenerada = await generarRecetaPDFSimple(formData, 'url');
    
    setPdfBlob(pdfBlobGenerado);
    setPdfUrl(pdfUrlGenerada);
    setMostrarModalCorreo(true);
    
    console.log("✅ PDF generado para modal de correo");

  } catch (error) {
    console.error("❌ Error generando PDF para correo:", error);
    setMensaje("❌ Error al preparar el envío de correo");
  } finally {
    setCargando(false);
  }
};
  return (
    <div className={styles.mainLayout}>
      <SidebarMenu opcionesCustom={SidebarDoctor} />

      <div className={styles.contentArea}>
        {/* HEADER */}
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

        {/* CONTENIDO PRINCIPAL */}
        <div className={styles.scrollContainer}>
          <div className={styles.mainContent}>

            {/* MENSAJES DE ESTADO */}
            {(cargando || mensaje) && (
              <div className={styles.estadoContainer}>
                <div className={cargando ? styles.cargando : styles.mensaje}>
                  {cargando ? (
                    <>
                      <span className="material-icons">hourglass_empty</span>
                      <span>{mensaje}</span>
                    </>
                  ) : (
                    <>
                      <span className={`material-icons ${mensaje.includes('✅') ? styles.exito : styles.error}`}>
                        {mensaje.includes('✅') ? 'check_circle' : 'error'}
                      </span>
                      <span>{mensaje}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* FORMULARIO */}
            <form className={styles.compactForm}>
              
              {/* DATOS DEL MÉDICO */}
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                  <span className="material-icons">{Iconos.medico}</span>
                  Datos del Médico
                </h2>
                <div className={styles.gridForm}>
                  <div className={styles.inputGroup}>
                    <label>Nombre Completo</label>
                    <input 
                      type="text" 
                      name="doctorNombre" 
                      value={formData.doctorNombre} 
                      onChange={handleInput}
                      placeholder="Cargando datos del doctor..."
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Cédula Profesional</label>
                    <input 
                      type="text" 
                      name="doctorCedula" 
                      value={formData.doctorCedula} 
                      onChange={handleInput}
                      placeholder="Cédula profesional"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Teléfono</label>
                    <input 
                      type="text" 
                      name="doctorTelefono" 
                      value={formData.doctorTelefono} 
                      onChange={handleInput}
                      placeholder="Teléfono del doctor"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input 
                      type="email" 
                      name="doctorEmail" 
                      value={formData.doctorEmail} 
                      onChange={handleInput}
                      placeholder="Email del doctor"
                    />
                  </div>
                </div>
              </div>

              {/* DATOS DEL PACIENTE */}
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                  <span className="material-icons">{Iconos.paciente}</span>
                  Datos del Paciente
                </h2>
                <div className={styles.gridForm}>
                  <div className={styles.inputGroup}>
                    <label>Nombre Completo</label>
                    <input 
                      type="text" 
                      name="pacienteNombre" 
                      value={formData.pacienteNombre} 
                      onChange={handleInput}
                      placeholder="Cargando datos del paciente..."
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Edad</label>
                    <input 
                      type="number" 
                      name="pacienteEdad" 
                      value={formData.pacienteEdad} 
                      onChange={handleInput}
                      placeholder="Edad del paciente"
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
                    {formData.pacienteNacimiento && (
                      <small className={styles.fechaInfo}>
                        Fecha cargada: {formData.pacienteNacimiento}
                      </small>
                    )}
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Teléfono</label>
                    <input 
                      type="text" 
                      name="pacienteTelefono" 
                      value={formData.pacienteTelefono} 
                      onChange={handleInput}
                      placeholder="Teléfono del paciente"
                    />
                  </div>
                  <div className={styles.inputGroupFull}>
                    <label>Alergias Conocidas</label>
                    <input 
                      type="text" 
                      name="pacienteAlergias" 
                      value={formData.pacienteAlergias} 
                      onChange={handleInput}
                      placeholder="Alergias del paciente"
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
                    <label>Temperatura (°C)</label>
                    <input 
                      type="text" 
                      name="temperatura" 
                      value={formData.temperatura} 
                      onChange={handleInput}
                      placeholder="Ej: 36.5"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Presión Arterial</label>
                    <input 
                      type="text" 
                      name="presion" 
                      value={formData.presion} 
                      onChange={handleInput}
                      placeholder="Ej: 120/80"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Estatura (cm)</label>
                    <input 
                      type="text" 
                      name="estatura" 
                      value={formData.estatura} 
                      onChange={handleInput}
                      placeholder="Ej: 170"
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
                    value={formData.tratamiento}
                    onChange={handleInput}
                    rows="6"
                    placeholder="Describa el tratamiento completo, medicamentos, dosis, frecuencia, duración, recomendaciones, etc."
                  ></textarea>
                </div>
              </div>

            </form>

            {/* BOTONES DE ACCIÓN ACTUALIZADOS */}
            <div className={styles.actionBar}>
              <button 
                className={styles.saveBtn}
                onClick={generarPDF}
                disabled={cargando || !formData.pacienteNombre}
              >
                <span className="material-icons">{Iconos.guardar}</span>
                Descargar Receta
              </button>

              <button 
                className={styles.emailBtn}
                onClick={abrirModalCorreo}
                disabled={cargando || !formData.pacienteNombre}
              >
                <span className="material-icons">{Iconos.correo}</span>
                Enviar por Correo
              </button>
            </div>

            {/* MODAL DE CORREO */}
            {mostrarModalCorreo && (
              <ModalEnvioCorreo
                formData={formData}
                onClose={() => {
                  setMostrarModalCorreo(false);
                  setPdfBlob(null);
                  setPdfUrl("");
                }}
                emailPaciente={emailPaciente}
                setEmailPaciente={setEmailPaciente}
                pdfBlob={pdfBlob}
                pdfUrl={pdfUrl}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}