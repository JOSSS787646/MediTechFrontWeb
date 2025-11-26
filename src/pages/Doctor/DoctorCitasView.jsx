// DoctorCitasView.jsx
import React, { useState, useEffect } from "react";
import SidebarMenu from "../../Components/SidebarMenu";
import styles from "../../styles/pages/DoctorCitasView.module.css";
import logo from "../../assets/logoLargo.png";
import { SidebarDoctor } from "../../Config/sidebars";

// 🔹 Servicios
import { getEspecialidades } from "../../Api/especialidad";
import { getColaboradoresByEspecialidad } from "../../Api/colaborator";
import { getCedes } from "../../Api/cede";

export default function DoctorCitasView() {
  const [usuario, setUsuario] = useState(null);

  // 🔹 Listas dinámicas
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [cedes, setCedes] = useState([]);

  const [loadingEspecialidades, setLoadingEspecialidades] = useState(true);
  const [loadingMedicos, setLoadingMedicos] = useState(false);

  const [formData, setFormData] = useState({
    curp: "",
    especialidad: "",
    medico: "",
    sede: "",
    fecha: "",
    hora: "",
    motivo: "",
  });

  // 🔹 Cargar datos del usuario
  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));
  }, []);

  // 🔹 Cargar especialidades y cedes al iniciar
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
    } finally {
      setLoadingEspecialidades(false);
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
      setLoadingMedicos(true);
      try {
        const data = await getColaboradoresByEspecialidad(formData.especialidad);
        setMedicos(data);
      } catch (err) {
        console.error("Error cargando médicos:", err);
      } finally {
        setLoadingMedicos(false);
      }
    };

    loadMedicos();
  }, [formData.especialidad]);

  
  // 🔹 Form handlers
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    alert("Cita registrada:\n" + JSON.stringify(formData, null, 2));
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
            {/* CURP */}
            <div className={styles.inputGroupFull}>
              <label>CURP del paciente:</label>
              <input
                type="text"
                name="curp"
                placeholder="Ingresa CURP y presiona ENTER"
                value={formData.curp}
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

                  {loadingEspecialidades && <option>Cargando...</option>}

                  {!loadingEspecialidades &&
                    especialidades.map((esp) => (
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

                  {loadingMedicos && <option>Cargando...</option>}

                  {!loadingMedicos &&
                    medicos.map((m) => (
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
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Fecha de cita</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* HORA */}
            <div className={styles.inputGroupFull}>
              <label>Hora</label>
              <select
                name="hora"
                value={formData.hora}
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
              <label>Motivo de consulta:</label>
              <textarea
                name="motivo"
                placeholder="Describe brevemente el motivo..."
                value={formData.motivo}
                onChange={handleChange}
              ></textarea>
            </div>
          </form>

          {/* BOTÓN FIJO */}
          <button className={styles.fixedSaveBtn} onClick={handleSave}>
            Registrar cita
          </button>
        </div>
      </main>
    </div>
  );
}
