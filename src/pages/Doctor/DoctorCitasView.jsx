import React, { useState, useEffect } from "react";
import SidebarMenu from "../../Components/SidebarMenu";
import styles from "../../styles/pages/DoctorCitasView.module.css";
import logo from "../../assets/logoLargo.png";
import { SidebarDoctor } from "../../Config/sidebars";

// 🔹 Servicios externos
import { getEspecialidades } from "../../Api/especialidad";
import { getColaboradoresByEspecialidad } from "../../Api/colaborator";
import { getCedes } from "../../Api/cede";

export default function DoctorCitasView() {
  const [usuario, setUsuario] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 🔹 Listas dinámicas
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [cedes, setCedes] = useState([]);

  // 🔹 Estados de carga
  const [loading, setLoading] = useState(false);

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
  });

  // 🔹 Estados de error
  const [errors, setErrors] = useState({});

  // 🔹 Cargar usuario y hora actual
  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 🔹 Cargar catálogos
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

  // 🔹 Cargar médicos cuando cambia la especialidad
  useEffect(() => {
    if (!formData.especialidad) {
      setMedicos([]);
      setFormData(prev => ({ ...prev, medico: "" }));
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

  // 🔹 Formatear fecha y hora
  const formatTime = (date) => {
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 🔹 Calcular edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // 🔹 Validar fecha de nacimiento (Mayor de 18 años)
  const validateBirthDate = (date) => {
    if (!date) return { valid: false, message: "" };
    
    const age = calculateAge(date);
    
    if (age < 18) {
      return { 
        valid: false, 
        message: `El paciente tiene ${age} años. Debe ser mayor de 18 años.` 
      };
    }
    
    return { valid: true, message: "" };
  };

  // 🔹 Validar fecha de cita (Debe ser futura)
  const validateAppointmentDate = (date) => {
    if (!date) return { valid: false, message: "" };
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return { 
        valid: false, 
        message: "La fecha de cita debe ser hoy o una fecha futura." 
      };
    }
    
    return { valid: true, message: "" };
  };

  // 🔹 Validaciones en tiempo real
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'fechaNacimiento':
        const birthValidation = validateBirthDate(value);
        if (!birthValidation.valid && value) {
          newErrors.fechaNacimiento = birthValidation.message;
        } else {
          delete newErrors.fechaNacimiento;
        }
        break;

      case 'fechaCita':
        const dateValidation = validateAppointmentDate(value);
        if (!dateValidation.valid && value) {
          newErrors.fechaCita = dateValidation.message;
        } else {
          delete newErrors.fechaCita;
        }
        break;

      case 'curp':
        if (value && value.length !== 18) {
          newErrors.curp = "La CURP debe tener exactamente 18 caracteres";
        } else {
          delete newErrors.curp;
        }
        break;

      case 'horaCita':
        if (value && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
          newErrors.horaCita = "Formato de hora inválido (HH:MM)";
        } else {
          delete newErrors.horaCita;
        }
        break;

      default:
        if (!value) {
          delete newErrors[name];
        }
        break;
    }

    setErrors(newErrors);
  };

  // 🔹 Change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // 🔹 Validar formulario completo
  const validateForm = () => {
    const newErrors = {};

    // Validaciones básicas de campos requeridos
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido";
    if (!formData.apellidoPaterno.trim()) newErrors.apellidoPaterno = "Apellido paterno es requerido";
    if (!formData.apellidoMaterno.trim()) newErrors.apellidoMaterno = "Apellido materno es requerido";
    if (!formData.curp.trim()) newErrors.curp = "CURP es requerido";
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = "Fecha de nacimiento es requerida";
    if (!formData.fechaCita) newErrors.fechaCita = "Fecha de cita es requerida";
    if (!formData.horaCita) newErrors.horaCita = "Hora de cita es requerida";
    if (!formData.especialidad) newErrors.especialidad = "Especialidad es requerida";
    if (!formData.medico) newErrors.medico = "Médico es requerido";
    if (!formData.sede) newErrors.sede = "Sede es requerida";
    if (!formData.motivo.trim()) newErrors.motivo = "Motivo de consulta es requerido";

    // Validaciones específicas
    if (formData.curp && formData.curp.length !== 18) {
      newErrors.curp = "La CURP debe tener exactamente 18 caracteres";
    }

    // Validar edad
    const birthValidation = validateBirthDate(formData.fechaNacimiento);
    if (!birthValidation.valid && formData.fechaNacimiento) {
      newErrors.fechaNacimiento = birthValidation.message;
    }

    // Validar fecha de cita
    const dateValidation = validateAppointmentDate(formData.fechaCita);
    if (!dateValidation.valid && formData.fechaCita) {
      newErrors.fechaCita = dateValidation.message;
    }

    // Validar formato de hora
    if (formData.horaCita && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.horaCita)) {
      newErrors.horaCita = "Formato de hora inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Obtener fecha mínima para cita (hoy)
  const getMinAppointmentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 🔹 Obtener fecha máxima para nacimiento (18 años atrás)
  const getMaxBirthDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  // 🔹 Guardar cita
  const handleSave = async () => {
    if (!validateForm()) {
      alert("⚠️ Por favor corrija los errores en el formulario antes de continuar.");
      return;
    }

    setLoading(true);

    try {
      // Obtener los nombres reales de los dropdowns
      const especialidadSeleccionada = especialidades.find(
        (e) => e.id === parseInt(formData.especialidad)
      );
      const medicoSeleccionado = medicos.find(
        (m) => m.id === parseInt(formData.medico)
      );
      const sedeSeleccionada = cedes.find(
        (s) => s.id === parseInt(formData.sede)
      );

      if (!especialidadSeleccionada || !medicoSeleccionado || !sedeSeleccionada) {
        alert("❌ Error al obtener los datos seleccionados");
        return;
      }

      // Preparar datos para enviar
      const citaData = {
        nombre: formData.nombre.trim(),
        apellidoPaterno: formData.apellidoPaterno.trim(),
        apellidoMaterno: formData.apellidoMaterno.trim(),
        curp: formData.curp.trim().toUpperCase(),
        fechaNacimiento: formData.fechaNacimiento,
        fechaCita: formData.fechaCita,
        horaCita: formData.horaCita,
        especialidad: especialidadSeleccionada.nombre,
        medico: medicoSeleccionado.nombre,
        sede: sedeSeleccionada.direccion,
        motivo: formData.motivo.trim(),
      };

      console.log("📤 Enviando cita:", citaData);

      // Aquí iría tu llamada a la API
      // await registerCita(citaData);

      // Mostrar éxito
      alert("✅ Cita registrada exitosamente");

      // Limpiar formulario
      setFormData({
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
      });
      
      setErrors({});

    } catch (error) {
      console.error("❌ Error:", error);
      alert("❌ Error al registrar la cita: " + (error.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mainLayout}>
      <SidebarMenu opcionesCustom={SidebarDoctor} passObject={true} />

      <div className={styles.contentArea}>
        <div className={styles.container}>
          
          {/* ===== HEADER COMPACTO - FIJADO ===== */}
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

          {/* ===== ENCABEZADO DE SECCIÓN - FIJADO ===== */}
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

          {/* ===== CONTENEDOR PRINCIPAL CON SCROLL - SOLO EL FORMULARIO ===== */}
          <div className={styles.scrollContainer}>
            <div className={styles.formContent}>
              
              {/* DATOS PERSONALES */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionSubtitle}>
                  <span className="material-icons">person</span>
                  Datos del Paciente
                </h3>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">badge</span>
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ingrese el nombre"
                      className={`${styles.formInput} ${errors.nombre ? styles.inputError : ''}`}
                    />
                    {errors.nombre && <span className={styles.errorText}>{errors.nombre}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">badge</span>
                      Apellido Paterno
                    </label>
                    <input
                      type="text"
                      name="apellidoPaterno"
                      value={formData.apellidoPaterno}
                      onChange={handleChange}
                      placeholder="Ingrese apellido paterno"
                      className={`${styles.formInput} ${errors.apellidoPaterno ? styles.inputError : ''}`}
                    />
                    {errors.apellidoPaterno && <span className={styles.errorText}>{errors.apellidoPaterno}</span>}
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
                      onChange={handleChange}
                      placeholder="Ingrese apellido materno"
                      className={`${styles.formInput} ${errors.apellidoMaterno ? styles.inputError : ''}`}
                    />
                    {errors.apellidoMaterno && <span className={styles.errorText}>{errors.apellidoMaterno}</span>}
                  </div>

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
                      placeholder="Ingrese CURP (18 caracteres)"
                      maxLength="18"
                      className={`${styles.formInput} ${errors.curp ? styles.inputError : ''}`}
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.curp && <span className={styles.errorText}>{errors.curp}</span>}
                  </div>

                  <div className={styles.inputGroupFull}>
                    <label>
                      <span className="material-icons">cake</span>
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      max={getMaxBirthDate()}
                      className={`${styles.formInput} ${errors.fechaNacimiento ? styles.inputError : ''}`}
                    />
                    {errors.fechaNacimiento && (
                      <div className={styles.errorAlert}>
                        <span className="material-icons">error</span>
                        {errors.fechaNacimiento}
                      </div>
                    )}
                    {!errors.fechaNacimiento && formData.fechaNacimiento && (
                      <div className={styles.successAlert}>
                        <span className="material-icons">check_circle</span>
                        Edad: {calculateAge(formData.fechaNacimiento)} años (válido)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* DATOS DE LA CITA */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionSubtitle}>
                  <span className="material-icons">medical_services</span>
                  Información de la Cita
                </h3>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">local_hospital</span>
                      Especialidad
                    </label>
                    <select
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      className={`${styles.formSelect} ${errors.especialidad ? styles.inputError : ''}`}
                    >
                      <option value="">Seleccione una especialidad</option>
                      {especialidades.map((esp) => (
                        <option key={esp.id} value={esp.id}>
                          {esp.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.especialidad && <span className={styles.errorText}>{errors.especialidad}</span>}
                  </div>

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
                      className={`${styles.formSelect} ${errors.medico ? styles.inputError : ''}`}
                    >
                      <option value="">Seleccione un médico</option>
                      {medicos.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre} {m.apellidoPaterno}
                        </option>
                      ))}
                    </select>
                    {errors.medico && <span className={styles.errorText}>{errors.medico}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">location_on</span>
                      Sede
                    </label>
                    <select
                      name="sede"
                      value={formData.sede}
                      onChange={handleChange}
                      className={`${styles.formSelect} ${errors.sede ? styles.inputError : ''}`}
                    >
                      <option value="">Seleccione una sede</option>
                      {cedes.map((sede) => (
                        <option key={sede.id} value={sede.id}>
                          {`${sede.ciudad} - ${sede.direccion}`}
                        </option>
                      ))}
                    </select>
                    {errors.sede && <span className={styles.errorText}>{errors.sede}</span>}
                  </div>

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
                      className={`${styles.formInput} ${errors.fechaCita ? styles.inputError : ''}`}
                    />
                    {errors.fechaCita && (
                      <div className={styles.errorAlert}>
                        <span className="material-icons">error</span>
                        {errors.fechaCita}
                      </div>
                    )}
                    {!errors.fechaCita && formData.fechaCita && (
                      <div className={styles.successAlert}>
                        <span className="material-icons">check_circle</span>
                        Fecha válida
                      </div>
                    )}
                  </div>

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
                      className={`${styles.formInput} ${styles.timeInput} ${errors.horaCita ? styles.inputError : ''}`}
                    />
                    {errors.horaCita && <span className={styles.errorText}>{errors.horaCita}</span>}
                    <small className={styles.helperText}>
                      Horario de atención: 8:00 AM - 6:00 PM
                    </small>
                  </div>
                </div>

                <div className={styles.inputGroupFull}>
                  <label>
                    <span className="material-icons">notes</span>
                    Motivo de Consulta
                  </label>
                  <textarea
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleChange}
                    placeholder="Describa el motivo de la cita..."
                    rows="4"
                    className={`${styles.formTextarea} ${errors.motivo ? styles.inputError : ''}`}
                  ></textarea>
                  {errors.motivo && <span className={styles.errorText}>{errors.motivo}</span>}
                </div>

                {/* BOTÓN DE GUARDADO DENTRO DEL FORMULARIO */}
                <div className={styles.formActions}>
                  <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={loading}
                    type="button"
                  >
                    {loading ? (
                      <>
                        <span className="material-icons" style={{ animation: 'spin 1s linear infinite' }}>sync</span>
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