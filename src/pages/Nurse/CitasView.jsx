import React, { useState, useEffect } from "react";
import SidebarMenu from "../../Components/SidebarMenu";
import styles from "../../styles/pages/DoctorCitasView.module.css";
import logo from "../../assets/logoLargo.png";
import { SidebarNurse } from "../../Config/sidebars";

// API
import { getPacienteByCurp } from "../../Api/paciente";
import { getEspecialidades } from "../../Api/especialidad";
import { getCedes } from "../../Api/cede";
import { getColaboradoresByEspecialidad } from "../../Api/colaborator";
import { createCitaPublica } from "../../Api/cita";

export default function CitasView() {
  const [usuario, setUsuario] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [cedes, setCedes] = useState([]);

  const [loadingPaciente, setLoadingPaciente] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    curp: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    especialidad: "",
    medico: "",
    sede: "",
    fechaCita: "",
    horaCita: "",
    motivo: "",
  });

  const [errors, setErrors] = useState({});
  const [pacienteInfo, setPacienteInfo] = useState(null);

  // ============================
  // Cargar usuario y hora
  // ============================
  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ============================
  // Cargar catálogos
  // ============================
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

  // ============================
  // Buscar paciente por CURP
  // ============================
  const buscarPaciente = async () => {
    if (formData.curp.length !== 18) {
      setErrors({ curp: "La CURP debe tener 18 caracteres" });
      return;
    }

    setLoadingPaciente(true);

    try {
      const paciente = await getPacienteByCurp(formData.curp.toUpperCase());

      if (!paciente) {
        setPacienteInfo(null);
        setErrors({ curp: "Paciente no encontrado" });
        setLoadingPaciente(false);
        return;
      }

      setErrors({});
      setPacienteInfo(paciente);

      setFormData((prev) => ({
        ...prev,
        nombre: paciente.nombre,
        apellidoPaterno: paciente.apellidoPaterno,
        apellidoMaterno: paciente.apellidoMaterno,
        fechaNacimiento: paciente.fechaNacimiento?.split("T")[0] || "",
      }));

    } catch (error) {
      setErrors({ curp: "Error buscando paciente" });
    }

    setLoadingPaciente(false);
  };

  // ============================
  // Cargar médicos cuando cambia la especialidad
  // ============================
  const fetchMedicos = async (id) => {
    try {
      if (!id) return setMedicos([]);

      const data = await getColaboradoresByEspecialidad(parseInt(id));
      setMedicos(data);
    } catch (error) {
      console.error("Error cargando médicos:", error);
    }
  };

  // ============================
  // Manejo de cambios
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "especialidad") {
      setFormData((prev) => ({ ...prev, medico: "" }));
      fetchMedicos(value);
    }
  };

  // ============================
  // Validación
  // ============================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.curp.trim()) newErrors.curp = "CURP requerida";
    if (!pacienteInfo) newErrors.paciente = "Debes buscar el paciente";
    if (!formData.especialidad) newErrors.especialidad = "Especialidad requerida";
    if (!formData.medico) newErrors.medico = "Médico requerido";
    if (!formData.sede) newErrors.sede = "Sede requerida";
    if (!formData.fechaCita) newErrors.fechaCita = "Fecha requerida";
    if (!formData.horaCita) newErrors.horaCita = "Hora requerida";
    if (!formData.motivo.trim()) newErrors.motivo = "Motivo requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================
  // Registrar cita (igual que doctor)
  // ============================
  const handleRegistrarCita = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const especialidadObj = especialidades.find(
        (e) => e.id === Number(formData.especialidad)
      );

      const medicoObj = medicos.find(
        (m) => m.id === Number(formData.medico)
      );

      const sedeObj = cedes.find(
        (c) => c.id === Number(formData.sede)
      );

      const citaDto = {
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        curp: formData.curp.toUpperCase(),
        fechaNacimiento: formData.fechaNacimiento,

        especialidad: especialidadObj?.nombre || "",
        medico: medicoObj?.nombre || "",
        sede: sedeObj?.direccion || "",

        motivo: formData.motivo,
        fechaCita: formData.fechaCita,
        horaCita: formData.horaCita,
      };

      await createCitaPublica(citaDto);

      setShowSuccess(true);

      // Reiniciar formulario
      setFormData({
        curp: "",
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        fechaNacimiento: "",
        especialidad: "",
        medico: "",
        sede: "",
        fechaCita: "",
        horaCita: "",
        motivo: "",
      });

      setPacienteInfo(null);

    } catch (error) {
      console.error("❌ Error registrando cita:", error);
      alert("Error al registrar la cita.");
    }

    setLoading(false);
  };

  const getMinAppointmentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className={styles.mainLayout}>
      <SidebarMenu opcionesCustom={SidebarNurse} passObject={true} />

      <div className={styles.contentArea}>
        <div className={styles.container}>

          {/* HEADER */}
          <header className={styles.header}>
            <div className={styles.logoBox}>
              <img src={logo} alt="Logo" className={styles.logo} />
            </div>

            <div className={styles.userInfo}>
              <div className={styles.userName}>
                <span className="material-icons">account_circle</span>
                {usuario?.nombreUsuario || "Enfermería"}
              </div>

              <div className={styles.timeInfo}>
                <div className={styles.time}>
                  {currentTime.toLocaleTimeString("es-MX")}
                </div>
                <div className={styles.date}>
                  {currentTime.toLocaleDateString("es-MX")}
                </div>
              </div>
            </div>
          </header>

          {/* TÍTULO */}
          <section className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <span className="material-icons">event_note</span>
              Registrar Nueva Cita
            </div>
          </section>

          {/* FORM */}
          <div className={styles.scrollContainer}>
            <div className={styles.formContent}>

              {/* BUSCAR PACIENTE */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionSubtitle}>
                  <span className="material-icons">fingerprint</span>
                  Buscar Paciente
                </h3>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroupFull}>
                    <label>CURP del paciente</label>
                    <input
                      type="text"
                      name="curp"
                      value={formData.curp}
                      onChange={handleChange}
                      maxLength={18}
                      style={{ textTransform: "uppercase" }}
                      className={`${styles.formInput} ${errors.curp ? styles.inputError : ""}`}
                    />

                    <button
                      type="button"
                      onClick={buscarPaciente}
                      className={styles.saveButton}
                    >
                      Buscar Paciente
                    </button>

                    {loadingPaciente && <p>Buscando...</p>}

                    {pacienteInfo && (
                      <p style={{ color: "green" }}>
                        Paciente encontrado: <b>{pacienteInfo.nombre} {pacienteInfo.apellidoPaterno}</b>
                      </p>
                    )}

                    {errors.curp && <p className={styles.errorText}>{errors.curp}</p>}
                  </div>
                </div>
              </div>

              {/* INFO CITA */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionSubtitle}>
                  <span className="material-icons">medical_services</span>
                  Información de la Cita
                </h3>

                <div className={styles.formGrid}>
                  
                  {/* ESPECIALIDAD */}
                  <div className={styles.inputGroup}>
                    <label>Especialidad</label>
                    <select
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      className={`${styles.formSelect} ${errors.especialidad ? styles.inputError : ""}`}
                    >
                      <option value="">Seleccione</option>
                      {especialidades.map((e) => (
                        <option key={e.id} value={e.id}>{e.nombre}</option>
                      ))}
                    </select>
                    {errors.especialidad && <p className={styles.errorText}>{errors.especialidad}</p>}
                  </div>

                  {/* MÉDICO */}
                  <div className={styles.inputGroup}>
                    <label>Médico</label>
                    <select
                      name="medico"
                      value={formData.medico}
                      onChange={handleChange}
                      className={`${styles.formSelect} ${errors.medico ? styles.inputError : ""}`}
                      disabled={!formData.especialidad}
                    >
                      <option value="">Seleccione</option>
                      {medicos.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre} {m.apellidoPaterno}
                        </option>
                      ))}
                    </select>
                    {errors.medico && <p className={styles.errorText}>{errors.medico}</p>}
                  </div>

                  {/* SEDE */}
                  <div className={styles.inputGroup}>
                    <label>Sede</label>
                    <select
                      name="sede"
                      value={formData.sede}
                      onChange={handleChange}
                      className={`${styles.formSelect} ${errors.sede ? styles.inputError : ""}`}
                    >
                      <option value="">Seleccione</option>
                      {cedes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.ciudad} - {c.direccion}
                        </option>
                      ))}
                    </select>
                    {errors.sede && <p className={styles.errorText}>{errors.sede}</p>}
                  </div>

                  {/* FECHA */}
                  <div className={styles.inputGroup}>
                    <label>Fecha</label>
                    <input
                      type="date"
                      name="fechaCita"
                      value={formData.fechaCita}
                      onChange={handleChange}
                      className={`${styles.formInput} ${errors.fechaCita ? styles.inputError : ""}`}
                      min={getMinAppointmentDate()}
                    />
                    {errors.fechaCita && <p className={styles.errorText}>{errors.fechaCita}</p>}
                  </div>

                  {/* HORA */}
                  <div className={styles.inputGroup}>
                    <label>Hora</label>
                    <input
                      type="time"
                      name="horaCita"
                      value={formData.horaCita}
                      onChange={handleChange}
                      className={`${styles.formInput} ${errors.horaCita ? styles.inputError : ""}`}
                      min="08:00"
                      max="18:00"
                      step="1800"
                    />
                    {errors.horaCita && <p className={styles.errorText}>{errors.horaCita}</p>}
                  </div>

                  {/* MOTIVO */}
                  <div className={styles.inputGroupFull}>
                    <label>Motivo</label>
                    <textarea
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleChange}
                      className={`${styles.formTextarea} ${errors.motivo ? styles.inputError : ""}`}
                      rows={3}
                    ></textarea>
                    {errors.motivo && <p className={styles.errorText}>{errors.motivo}</p>}
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    className={styles.saveButton}
                    disabled={loading}
                    onClick={handleRegistrarCita}
                  >
                    Registrar Cita
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ===== MODAL DE ÉXITO ===== */}
      {showSuccess && (
        <div className={styles.successModalOverlay}>
          <div className={styles.successModal}>
            
            <span className="material-icons" style={{ fontSize: "60px", color: "var(--success-color)" }}>
              check_circle
            </span>

            <h2 className={styles.successTitle}>¡Cita Registrada!</h2>

            <p className={styles.successMessage}>
              La cita se ha guardado correctamente en el sistema.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className={styles.successButton}
            >
              Aceptar
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
