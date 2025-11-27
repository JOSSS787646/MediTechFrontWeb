import React, { useState, useEffect } from "react";
import SidebarMenu from "../../Components/SidebarMenu";
import styles from "../../styles/pages/DoctorCitasView.module.css";
import logo from "../../assets/logoLargo.png";
import { SidebarDoctor } from "../../Config/sidebars";

// 🔹 Servicios externos
import { getEspecialidades } from "../../Api/especialidad";
import { getColaboradoresByEspecialidad } from "../../Api/colaborator";
import { getCedes } from "../../Api/cede";
import { createCita } from "../../Api/cita";

export default function DoctorCitasView() {
  const [usuario, setUsuario] = useState(null);

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

  // 🔹 Cargar usuario
  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));
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

  // 🔹 Change handler
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Guardar cita
  const handleSave = async () => {
    setLoading(true);

    try {
      // Validaciones básicas
      if (!formData.nombre || !formData.apellidoPaterno || !formData.apellidoMaterno) {
        setLoading(false);
        return alert("Por favor completa nombre completo");
      }
      if (!formData.curp || !formData.fechaNacimiento) {
        setLoading(false);
        return alert("Por favor completa CURP y fecha de nacimiento");
      }
      if (!formData.fechaCita || !formData.horaCita) {
        setLoading(false);
        return alert("Por favor seleccione fecha y hora de la cita");
      }
      if (!formData.especialidad || !formData.medico || !formData.sede) {
        setLoading(false);
        return alert("Por favor seleccione especialidad, médico y sede");
      }
      if (!formData.motivo) {
        setLoading(false);
        return alert("Por favor ingrese el motivo de la consulta");
      }

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
        setLoading(false);
        return alert("Error al obtener los datos seleccionados");
      }

      // Preparar datos para enviar
      const citaData = {
        nombre: formData.nombre.trim(),
        apellidoPaterno: formData.apellidoPaterno.trim(),
        apellidoMaterno: formData.apellidoMaterno.trim(),
        curp: formData.curp.trim(),
        fechaNacimiento: formData.fechaNacimiento,
        fechaCita: formData.fechaCita,
        horaCita: formData.horaCita,
        especialidad: especialidadSeleccionada.nombre,
        medico: medicoSeleccionado.nombre,
        sede: sedeSeleccionada.direccion,
        motivo: formData.motivo.trim(),
      };

      console.log("📤 Enviando cita:", citaData);

      const resultado = await createCita(citaData);

      alert(`✅ Cita registrada correctamente con ID: ${resultado.id || resultado.ID}`);

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
    } catch (error) {
      console.error("❌ Error:", error);

      // Mostrar errores de validación del backend
      if (error.errors) {
        const mensajesError = Object.entries(error.errors)
          .map(([campo, mensajes]) => `${campo}: ${mensajes.join(", ")}`)
          .join("\n");
        alert(`Errores de validación:\n${mensajesError}`);
      } else {
        alert("Error al registrar la cita: " + (error.title || "Error desconocido"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mainLayout}>
      <SidebarMenu opcionesCustom={SidebarDoctor} passObject={true} />

      <main className={styles.contentArea}>
        <div className={styles.container}>
          {/* HEADER */}
          <header className={styles.header}>
            <img src={logo} alt="Logo" className={styles.logo} />
            <div className={styles.userBox}>
              <span className="material-icons">account_circle</span>
              <span>{usuario?.nombreUsuario || "Doctor"}</span>
            </div>
          </header>

          <h1>Hola prueba</h1>

          <hr className={styles.divider} />

          <div className={styles.titleSection}>
            <span className="material-icons" style={{ fontSize: '2.5rem', color: 'var(--sidebar-color)' }}>event_note</span>
            <h2 className={styles.title}>Registrar nueva cita</h2>
          </div>

          <form className={styles.fullForm}>
            {/* DATOS PERSONALES */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <span className="material-icons">person</span>
                Datos del Paciente
              </h3>

              <div className={styles.twoCols}>
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
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>
                    <span className="material-icons">badge</span>
                    Apellido paterno
                  </label>
                  <input
                    type="text"
                    name="apellidoPaterno"
                    value={formData.apellidoPaterno}
                    onChange={handleChange}
                    placeholder="Ingrese apellido paterno"
                  />
                </div>
              </div>

              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label>
                    <span className="material-icons">badge</span>
                    Apellido materno
                  </label>
                  <input
                    type="text"
                    name="apellidoMaterno"
                    value={formData.apellidoMaterno}
                    onChange={handleChange}
                    placeholder="Ingrese apellido materno"
                  />
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
                    placeholder="Ingrese CURP"
                    maxLength="18"
                  />
                </div>
              </div>

              <div className={styles.inputGroupFull}>
                <label>
                  <span className="material-icons">cake</span>
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* DATOS DE LA CITA */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <span className="material-icons">medical_services</span>
                Información de la Cita
              </h3>

              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label>
                    <span className="material-icons">local_hospital</span>
                    Especialidad
                  </label>
                  <select
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una especialidad</option>
                    {especialidades.map((esp) => (
                      <option key={esp.id} value={esp.id}>
                        {esp.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>
                    <span className="material-icons">person_outline</span>
                    Médico
                  </label>
                  <select
                    name="medico"
                    value={formData.medico}
                    onChange={handleChange}
                    disabled={!formData.especialidad}
                  >
                    <option value="">Seleccione un médico</option>
                    {medicos.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre} {m.apellidoPaterno}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label>
                    <span className="material-icons">location_on</span>
                    Sede
                  </label>
                  <select
                    name="sede"
                    value={formData.sede}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una sede</option>
                    {cedes.map((sede) => (
                      <option key={sede.id} value={sede.id}>
                        {`${sede.ciudad} - ${sede.direccion}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>
                    <span className="material-icons">calendar_today</span>
                    Fecha de cita
                  </label>
                  <input
                    type="date"
                    name="fechaCita"
                    value={formData.fechaCita}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.inputGroupFull}>
                <label>
                  <span className="material-icons">access_time</span>
                  Hora de cita
                </label>
                <select
                  name="horaCita"
                  value={formData.horaCita}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un horario</option>
                  <option>08:00</option>
                  <option>09:00</option>
                  <option>10:00</option>
                  <option>11:00</option>
                  <option>12:00</option>
                  <option>13:00</option>
                  <option>14:00</option>
                  <option>15:00</option>
                  <option>16:00</option>
                  <option>17:00</option>
                  <option>18:00</option>
                </select>
              </div>

              <div className={styles.inputGroupFull}>
                <label>
                  <span className="material-icons">notes</span>
                  Motivo de consulta
                </label>
                <textarea
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  placeholder="Describa el motivo de la cita..."
                  rows="5"
                ></textarea>
              </div>
            </div>
          </form>

          {/* BOTÓN */}
          <button
            className={styles.fixedSaveBtn}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="material-icons" style={{ animation: 'spin 1s linear infinite' }}>sync</span>
                Registrando...
              </>
            ) : (
              <>
                <span className="material-icons">check_circle</span>
                Registrar cita
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}