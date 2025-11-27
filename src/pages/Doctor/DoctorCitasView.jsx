// DoctorCitasView.jsx
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

  //const [loadingEspecialidades, setLoadingEspecialidades] = useState(true);
  //const [loadingMedicos, setLoadingMedicos] = useState(false);

  // 🔹 Datos del formulario (actualizado)
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

  // 🔹 Guardar cita real
const handleSave = async () => {
  try {
    // ✅ Validaciones básicas
    if (!formData.nombre || !formData.apellidoPaterno || !formData.apellidoMaterno) {
      return alert("Por favor completa nombre completo");
    }
    if (!formData.curp || !formData.fechaNacimiento) {
      return alert("Por favor completa CURP y fecha de nacimiento");
    }
    if (!formData.fechaCita || !formData.horaCita) {
      return alert("Por favor seleccione fecha y hora de la cita");
    }
    if (!formData.especialidad || !formData.medico || !formData.sede) {
      return alert("Por favor seleccione especialidad, médico y sede");
    }
    if (!formData.motivo) {
      return alert("Por favor ingrese el motivo de la consulta");
    }

    // ✅ Obtener los nombres reales de los dropdowns
    const especialidadSeleccionada = especialidades.find(
      e => e.id === parseInt(formData.especialidad)
    );
    const medicoSeleccionado = medicos.find(
      m => m.id === parseInt(formData.medico)
    );
    const sedeSeleccionada = cedes.find(
      s => s.id === parseInt(formData.sede)
    );

    if (!especialidadSeleccionada || !medicoSeleccionado || !sedeSeleccionada) {
      return alert("Error al obtener los datos seleccionados");
    }

    // ✅ Preparar datos para enviar
    const citaData = {
      nombre: formData.nombre.trim(),
      apellidoPaterno: formData.apellidoPaterno.trim(),
      apellidoMaterno: formData.apellidoMaterno.trim(),
      curp: formData.curp.trim(),
      fechaNacimiento: formData.fechaNacimiento, // "YYYY-MM-DD"
      fechaCita: formData.fechaCita, // "YYYY-MM-DD"
      horaCita: formData.horaCita, // "HH:mm"
      especialidad: especialidadSeleccionada.nombre, // Nombre de la especialidad
      medico: medicoSeleccionado.nombre, // Solo el nombre (sin apellidos)
      sede: sedeSeleccionada.direccion, // Dirección exacta
      motivo: formData.motivo.trim()
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
              {usuario?.nombreUsuario || "Doctor"}
            </div>
          </header>

          <hr className={styles.divider} />
          <h2 className={styles.title}>Registrar nueva cita</h2>

          <form className={styles.fullForm}>

            {/* DATOS PERSONALES */}
            <div className={styles.twoCols}>
              <div>
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Apellido paterno</label>
                <input
                  type="text"
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.twoCols}>
              <div>
                <label>Apellido materno</label>
                <input
                  type="text"
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>CURP</label>
                <input
                  type="text"
                  name="curp"
                  value={formData.curp}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.inputGroupFull}>
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
              />
            </div>

            {/* ESPECIALIDAD / MÉDICO */}
            <div className={styles.twoCols}>
              <div>
                <label>Especialidad</label>
                <select
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  {especialidades.map((esp) => (
                    <option key={esp.id} value={esp.id}>
                      {esp.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Médico</label>
                <select
                  name="medico"
                  value={formData.medico}
                  onChange={handleChange}
                  disabled={!formData.especialidad}
                >
                  <option value="">Seleccione</option>
                  {medicos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} {m.apellidoPaterno}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEDE / FECHA */}
            <div className={styles.twoCols}>
              <div>
                <label>Sede</label>
                <select
                  name="sede"
                  value={formData.sede}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  {cedes.map((sede) => (
                    <option key={sede.id} value={sede.id}>
                      {`${sede.ciudad} - ${sede.direccion}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Fecha de cita</label>
                <input
                  type="date"
                  name="fechaCita"
                  value={formData.fechaCita}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* HORA */}
            <div className={styles.inputGroupFull}>
              <label>Hora de cita</label>
              <select
                name="horaCita"
                value={formData.horaCita}
                onChange={handleChange}
              >
                <option value="">Seleccione</option>
                <option>08:00</option>
                <option>09:00</option>
                <option>10:00</option>
                <option>11:00</option>
              </select>
            </div>

            {/* MOTIVO */}
            <div className={styles.inputGroupFull}>
              <label>Motivo de consulta</label>
              <textarea
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                placeholder="Describa el motivo de la cita..."
              ></textarea>
            </div>

          </form>

          {/* BOTÓN */}
          <button className={styles.fixedSaveBtn} onClick={handleSave}>
            Registrar cita
          </button>
        </div>
      </main>
    </div>
  );
}
