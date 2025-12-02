import React, { useState, useEffect } from "react";
import SidebarMenu from "../../Components/SidebarMenu";
import styles from "../../styles/pages/DoctorCitasView.module.css";
import logo from "../../assets/logoLargo.png";
import { SidebarNurse } from "../../Config/sidebars";

import { getPacienteByCurp } from "../../Api/paciente";
import { getEspecialidades } from "../../Api/especialidad";
import { getCedes } from "../../Api/cede";
import { getColaboradoresByEspecialidad } from "../../Api/colaborator";
import { createCita } from "../../Api/cita";

export default function CitasView() {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState("");

  const [pacienteInfo, setPacienteInfo] = useState(null);

  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [cedes, setCedesState] = useState([]);

  const [loadingPaciente, setLoadingPaciente] = useState(false);

  const [formData, setFormData] = useState({
    curp: "",
    especialidad: "",
    medico: "",
    sede: "",
    fecha: "",
    hora: "",
    motivo: "",
  });

  // ============================
  // Cargar usuario y catálogos
  // ============================
  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    const tokenData = localStorage.getItem("token");

    if (userData) setUsuario(JSON.parse(userData));
    if (tokenData) setToken(tokenData);

    loadEspecialidades();
    loadCedes();
  }, []);

  // Cargar especialidades
  const loadEspecialidades = async () => {
    try {
      const data = await getEspecialidades();
      setEspecialidades(data);
    } catch (err) {
      console.error("Error cargando especialidades:", err);
    }
  };

  // Cargar cedes (corregido)
  const loadCedes = async () => {
    try {
      const data = await getCedes();

      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.resultado)
        ? data.resultado
        : Array.isArray(data?.data)
        ? data.data
        : [];

      console.log("CEDES:", lista);

      setCedesState(lista);
    } catch (err) {
      console.error("Error cargando cedes:", err);
    }
  };

  // Buscar paciente
  const buscarPaciente = async () => {
    if (formData.curp.length !== 18) {
      alert("La CURP debe tener 18 caracteres.");
      return;
    }

    setLoadingPaciente(true);

    try {
      const paciente = await getPacienteByCurp(formData.curp.toUpperCase());
      setPacienteInfo(paciente);
    } catch {
      alert("Paciente no encontrado.");
      setPacienteInfo(null);
    }

    setLoadingPaciente(false);
  };

  // Cargar médicos por especialidad
  const fetchMedicos = async (idEsp) => {
    try {
      if (!idEsp) {
        setMedicos([]);
        return;
      }

      const data = await getColaboradoresByEspecialidad(parseInt(idEsp));
      setMedicos(data);
    } catch (err) {
      console.error("Error cargando médicos:", err);
      setMedicos([]);
    }
  };

  // Manejo inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "especialidad") {
      fetchMedicos(e.target.value);
      setFormData((prev) => ({ ...prev, medico: "" }));
    }
  };

  // Registrar cita
  const handleRegistrarCita = async () => {
    if (!pacienteInfo) {
      alert("Primero debes buscar un paciente.");
      return;
    }

    try {
      const cita = {
        especialidad: Number(formData.especialidad),
        medico: Number(formData.medico),
        sede: Number(formData.sede),
        motivo: formData.motivo,
        fechaCita: formData.fecha,
        horaCita: formData.hora,
      };

      await createCita(cita, token);

      alert("Cita registrada exitosamente");

      setFormData({
        curp: "",
        especialidad: "",
        medico: "",
        sede: "",
        fecha: "",
        hora: "",
        motivo: "",
      });

      setPacienteInfo(null);
    } catch (err) {
      alert("Error al registrar la cita.");
      console.error(err);
    }
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
            </div>
          </header>

          {/* TÍTULO */}
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
                    <label>
                      <span className="material-icons">badge</span>
                      CURP del paciente
                    </label>

                    <input
                      type="text"
                      name="curp"
                      value={formData.curp}
                      onChange={handleChange}
                      maxLength={18}
                      className={styles.formInput}
                      style={{ textTransform: "uppercase" }}
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
                      <p style={{ color: "green", marginTop: 10 }}>
                        Paciente encontrado:{" "}
                        <b>
                          {pacienteInfo.nombre}{" "}
                          {pacienteInfo.apellidoPaterno}
                        </b>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* INFORMACIÓN DE LA CITA */}
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
                      <option value="">Seleccione</option>
                      {especialidades.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nombre}
                        </option>
                      ))}
                    </select>
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
                      className={styles.formSelect}
                    >
                      <option value="">Seleccione</option>
                      {medicos.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre} {m.apellidoPaterno}
                        </option>
                      ))}
                    </select>
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
                      <option value="">Seleccione</option>
                      {cedes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* FECHA */}
                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">calendar_today</span>
                      Fecha de Cita
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                  </div>

                  {/* HORA */}
                  <div className={styles.inputGroupFull}>
                    <label>
                      <span className="material-icons">access_time</span>
                      Hora
                    </label>
                    <select
                      name="hora"
                      value={formData.hora}
                      onChange={handleChange}
                      className={styles.formSelect}
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
                    <label>
                      <span className="material-icons">notes</span>
                      Motivo
                    </label>
                    <textarea
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleChange}
                      className={styles.formTextarea}
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                {/* BOTÓN GUARDAR */}
                <div className={styles.formActions}>
                  <button
                    className={styles.saveButton}
                    onClick={handleRegistrarCita}
                  >
                    <span className="material-icons">check_circle</span>
                    Registrar Cita
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
