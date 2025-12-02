import React, { useState, useEffect } from "react";
import SidebarMenu from "../../Components/SidebarMenu";
import styles from "../../styles/pages/DoctorCitasView.module.css";
import logo from "../../assets/logoLargo.png";
import { SidebarDoctor } from "../../Config/sidebars";

// 🔹 Servicios externos
import { getEspecialidades } from "../../Api/especialidad";
import { getColaboradoresByEspecialidad } from "../../Api/colaborator";
import { getCedes } from "../../Api/cede";
import { getPacienteByCurp } from "../../Api/paciente";
import { createCitaPublica } from "../../Api/cita";

export default function DoctorCitasView() {
  const [usuario, setUsuario] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 🔹 Listas dinámicas
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [cedes, setCedes] = useState([]);

  // 🔹 Estados de carga
  const [loading, setLoading] = useState(false);
  const [loadingPaciente, setLoadingPaciente] = useState(false);

  // 🔹 Datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    curp: "",
    fechaNacimiento: "",
    fechaCita: "",
    horaCita: "",
    especialidad: "",
    medico: "",
    sede: "",
    motivo: "",
    pacienteId: null,
  });

  const [errors, setErrors] = useState({});

  // 🔹 Cargar usuario y hora
  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔹 Cargar catálogos al entrar
  useEffect(() => {
    loadEspecialidades();
    loadCedes();
  }, []);

  const loadEspecialidades = async () => {
    try {
      const data = await getEspecialidades();
      setEspecialidades(data);
    } catch (err) {
      console.error("Error cargando especialidades:", err);
    }
  };

  const loadCedes = async () => {
    try {
      const data = await getCedes();
      setCedes(data);
    } catch (err) {
      console.error("Error cargando cedes:", err);
    }
  };

  // 🔹 Cargar médicos al cambiar especialidad
  useEffect(() => {
    if (!formData.especialidad) {
      setMedicos([]);
      return;
    }

    const loadMedicos = async () => {
      try {
        const data = await getColaboradoresByEspecialidad(formData.especialidad);
        setMedicos(data);
      } catch (err) {
        console.error("Error cargando médicos:", err);
      }
    };

    loadMedicos();
  }, [formData.especialidad]);

  // 🔹 Autocompletar por CURP
  useEffect(() => {
    const fetchPaciente = async () => {
      if (formData.curp.length !== 18) return;

      setLoadingPaciente(true);

      try {
        const paciente = await getPacienteByCurp(formData.curp.toUpperCase());

        if (!paciente) {
          setErrors((prev) => ({
            ...prev,
            curp: "No se encontró un paciente con esta CURP",
          }));
          return;
        }

        setFormData((prev) => ({
          ...prev,
          nombre: paciente.nombre || "",
          apellidoPaterno: paciente.apellidoPaterno || "",
          apellidoMaterno: paciente.apellidoMaterno || "",
          fechaNacimiento: paciente.fechaNacimiento?.split("T")[0] || "",
          pacienteId: paciente.id,
        }));

        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.curp;
          return updated;
        });
      } catch (error) {
        console.error("❌ Error buscando paciente:", error);
        setErrors((prev) => ({
          ...prev,
          curp: "Error al buscar paciente por CURP",
        }));
      } finally {
        setLoadingPaciente(false);
      }
    };

    fetchPaciente();
  }, [formData.curp]);

  // 🔹 Cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.curp.trim()) newErrors.curp = "CURP es requerido";
    if (!formData.fechaCita) newErrors.fechaCita = "Fecha de cita requerida";
    if (!formData.horaCita) newErrors.horaCita = "Hora requerida";
    if (!formData.especialidad) newErrors.especialidad = "Especialidad requerida";
    if (!formData.medico) newErrors.medico = "Médico requerido";
    if (!formData.sede) newErrors.sede = "Sede requerida";
    if (!formData.motivo.trim()) newErrors.motivo = "Motivo requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================================================================
  // 🔹 GUARDAR CITA REAL (CON LOGS DETALLADOS)
  // ================================================================
const handleSave = async () => {
  console.log("🔵 [GUARDAR] Iniciando guardado de cita pública...");

  console.log("📝 [FORM DATA COMPLETO]:", JSON.stringify(formData, null, 2));

  if (!validateForm()) {
    console.log("🔴 [GUARDAR] Errores de validación detectados:", errors);
    alert("Corrige los errores antes de continuar.");
    return;
  }

  setLoading(true);

  try {
    // 1️⃣ Especialidad → nombre
    const especialidadObj = especialidades.find(
      (e) => e.id === Number(formData.especialidad)
    );
    const especialidadNombre = especialidadObj?.nombre || "";


const medicoObj = medicos.find((m) => m.id === Number(formData.medico));
const medicoNombre = medicoObj?.nombre || ""; // ← 🔥 Corrección real

console.log("Médico (nombre exacto):", medicoNombre);



    // 3️⃣ Sede → solo la dirección
    const sedeObj = cedes.find((c) => c.id === Number(formData.sede));
    const sedeTexto = sedeObj?.direccion || ""; // 🔥 CORRECCIÓN AQUÍ

    console.log("🟦 [MAPEO FINAL]");
    console.log("Especialidad:", especialidadNombre);
    console.log("Médico (primer nombre):", medicoNombre);
    console.log("Sede (solo dirección):", sedeTexto);

    const citaDto = {
      nombre: formData.nombre,
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      curp: formData.curp.toUpperCase(),
      fechaNacimiento: formData.fechaNacimiento,

      especialidad: especialidadNombre,
      medico: medicoNombre,
      sede: sedeTexto, // ← 🔥 Solo dirección real

      motivo: formData.motivo,
      fechaCita: formData.fechaCita,
      horaCita: formData.horaCita,
    };

    console.log("📦 [DTO FINAL ARMADO]:", JSON.stringify(citaDto, null, 2));
    console.log("🚀 Enviando petición al backend...");

    const response = await createCitaPublica(citaDto);

    console.log("🟢 [RESPUESTA BACKEND]:", response);

    alert("✅ Cita registrada correctamente.");
  } catch (error) {
    console.error("🔴 [ERROR CAPTURADO EN FRONT]:", error);

    const backendMessage =
      error?.response?.data ||
      error?.message ||
      "Error desconocido del backend";

    alert(`❌ Error creando la cita:\n${JSON.stringify(backendMessage)}`);
  } finally {
    setLoading(false);
  }
};



  const formatTime = (date) =>
    date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date) =>
    date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getMinAppointmentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // ================================================================
  // ========================= RETURN ================================
  // ================================================================
  
  return (
    <div className={styles.mainLayout}>
      <SidebarMenu opcionesCustom={SidebarDoctor} passObject={true} />

      <div className={styles.contentArea}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.logoBox}>
              <img src={logo} alt="Logo" className={styles.logo} />
            </div>

            <div className={styles.userInfo}>
              <div className={styles.userName}>
                <span className="material-icons">account_circle</span>
                {usuario?.nombreUsuario || "Doctor"}
              </div>

              <div className={styles.timeInfo}>
                <div className={styles.time}>
                  <span className="material-icons">schedule</span>
                  {formatTime(currentTime)}
                </div>
                <div className={styles.date}>
                  <span className="material-icons">calendar_today</span>
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
          </header>

          <section className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <span className="material-icons">event_note</span>
              Registrar Nueva Cita
            </div>

            <div className={styles.appointmentCount}>
              <span className="material-icons">add</span>
              Nueva Cita
            </div>
          </section>

          <div className={styles.scrollContainer}>
            <div className={styles.formContent}>

              {/* DATOS PERSONALES */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionSubtitle}>
                  <span className="material-icons">person</span>
                  Datos del Paciente
                </h3>

                <div className={styles.formGrid}>
                  
                  {/* CURP */}
                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">fingerprint</span>
                      CURP
                    </label>
                    <input
                      type="text"
                      name="curp"
                      value={formData.curp}
                      onChange={handleChange}
                      placeholder="Ingrese CURP"
                      maxLength="18"
                      style={{ textTransform: "uppercase" }}
                      className={`${styles.formInput} ${errors.curp ? styles.inputError : ""}`}
                    />
                    {loadingPaciente && <small>Cargando datos...</small>}
                    {errors.curp && (
                      <span className={styles.errorText}>{errors.curp}</span>
                    )}
                  </div>

                  {/* NOMBRE */}
                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">badge</span>
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      disabled
                      className={styles.formInput}
                    />
                  </div>

                  {/* APELLIDOS */}
                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">badge</span>
                      Apellido Paterno
                    </label>
                    <input
                      type="text"
                      name="apellidoPaterno"
                      value={formData.apellidoPaterno}
                      disabled
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">badge</span>
                      Apellido Materno
                    </label>
                    <input
                      type="text"
                      name="apellidoMaterno"
                      value={formData.apellidoMaterno}
                      disabled
                      className={styles.formInput}
                    />
                  </div>

                  {/* FECHA NAC */}
                  <div className={styles.inputGroupFull}>
                    <label>
                      <span className="material-icons">cake</span>
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      disabled
                      className={styles.formInput}
                    />
                  </div>
                </div>
              </div>

              {/* DATOS DE CITA */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionSubtitle}>
                  <span className="material-icons">medical_services</span>
                  Información de la Cita
                </h3>

                <div className={styles.formGrid}>
                  
                  {/* ESPECIALIDAD */}
                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">local_hospital</span>
                      Especialidad
                    </label>
                    <select
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      className={styles.formSelect}
                    >
                      <option value="">Seleccione una especialidad</option>
                      {especialidades.map((esp) => (
                        <option key={esp.id} value={esp.id}>
                          {esp.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.especialidad && (
                      <span className={styles.errorText}>{errors.especialidad}</span>
                    )}
                  </div>

                  {/* MÉDICO */}
                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">person</span>
                      Médico
                    </label>
                    <select
                      name="medico"
                      value={formData.medico}
                      onChange={handleChange}
                      disabled={!formData.especialidad}
                      className={styles.formSelect}
                    >
                      <option value="">Seleccione un médico</option>
                      {medicos.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre} {m.apellidoPaterno}
                        </option>
                      ))}
                    </select>
                    {errors.medico && (
                      <span className={styles.errorText}>{errors.medico}</span>
                    )}
                  </div>

                  {/* SEDE */}
                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">location_on</span>
                      Sede
                    </label>
                    <select
                      name="sede"
                      value={formData.sede}
                      onChange={handleChange}
                      className={styles.formSelect}
                    >
                      <option value="">Seleccione una sede</option>
                      {cedes.map((sede) => (
                        <option key={sede.id} value={sede.id}>
                          {sede.ciudad} - {sede.direccion}
                        </option>
                      ))}
                    </select>
                    {errors.sede && (
                      <span className={styles.errorText}>{errors.sede}</span>
                    )}
                  </div>

                  {/* FECHA CITA */}
                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">calendar_today</span>
                      Fecha de Cita
                    </label>
                    <input
                      type="date"
                      name="fechaCita"
                      value={formData.fechaCita}
                      onChange={handleChange}
                      min={getMinAppointmentDate()}
                      className={styles.formInput}
                    />
                    {errors.fechaCita && (
                      <span className={styles.errorText}>{errors.fechaCita}</span>
                    )}
                  </div>

                  {/* HORA CITA */}
                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">access_time</span>
                      Hora de Cita
                    </label>
                    <input
                      type="time"
                      name="horaCita"
                      value={formData.horaCita}
                      onChange={handleChange}
                      min="08:00"
                      max="18:00"
                      step="1800"
                      className={styles.formInput}
                    />
                    {errors.horaCita && (
                      <span className={styles.errorText}>{errors.horaCita}</span>
                    )}
                  </div>
                </div>

                {/* MOTIVO */}
                <div className={styles.inputGroupFull}>
                  <label>
                    <span className="material-icons">notes</span>
                    Motivo de Consulta
                  </label>
                  <textarea
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleChange}
                    rows="4"
                    className={styles.formTextarea}
                  ></textarea>
                  {errors.motivo && (
                    <span className={styles.errorText}>{errors.motivo}</span>
                  )}
                </div>

                {/* BOTÓN */}
                <div className={styles.formActions}>
                  <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={loading}
                    type="button"
                  >
                    {loading ? (
                      <>
                        <span className="material-icons" style={{ animation: "spin 1s linear infinite" }}>sync</span>
                        Registrando...
                      </>
                    ) : (
                      <>
                        <span className="material-icons">check_circle</span>
                        Registrar Cita
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
