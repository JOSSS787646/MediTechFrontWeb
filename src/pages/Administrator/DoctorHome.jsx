import React, { useState, useEffect, useCallback } from "react";
import styles from "../../styles/pages/DoctorHome.module.css";
import logo from "../../assets/logoLargo.png";
import { useNavigate } from "react-router-dom";

import { verificarRolUsuario } from "../../Api/rol";
import { getColaboradorByCurp, getCitasDeColaborador } from "../../Api/colaborator";

import "material-icons/iconfont/material-icons.css";

const Iconos = {
  usuario: "account_circle",
  reloj: "schedule",
  calendario: "calendar_today",
  buscar: "search",
  citas: "today",
  evento: "event_available",
  paciente: "person",
  atender: "medical_services",
  vacio: "event_busy",
};

export default function DoctorHome() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [idColaboradorReal, setIdColaboradorReal] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState("Doctor");
  const [search, setSearch] = useState("");

  const [horaActual, setHoraActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");

  // ===========================================
  // OBTENER EL ID REAL DEL COLABORADOR
  // ===========================================
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const usuarioLS = JSON.parse(localStorage.getItem("usuario"));
        if (!usuarioLS || !usuarioLS.id) return;

        const usuarioId = usuarioLS.id;

        // 1️⃣ Traer rol y curp
        const rolData = await verificarRolUsuario(usuarioId);
        if (!rolData || !rolData.colaborador) return;

        const { nombre, apellidoPaterno, curp } = rolData.colaborador;

        setNombreUsuario(`${nombre} ${apellidoPaterno}`);

        // 2️⃣ Obtener colaborador real
        const colaboradorReal = await getColaboradorByCurp(curp);
        if (!colaboradorReal || !colaboradorReal.id) return;

        setIdColaboradorReal(colaboradorReal.id);

      } catch (error) {
        console.error("❌ Error obteniendo datos del colaborador", error);
      }
    };

    cargarDatosIniciales();
  }, []);

  // ===========================================
  // CALCULAR EDAD
  // ===========================================
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return "N/A";
    const f = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - f.getFullYear();
    if (hoy < new Date(f.setFullYear(hoy.getFullYear()))) edad--;
    return edad;
  };

  // ===========================================
  // CARGAR CITAS
  // ===========================================
  const cargarCitas = useCallback(async () => {
    if (!idColaboradorReal) return;
    try {
      const data = await getCitasDeColaborador(idColaboradorReal);
      if (!Array.isArray(data)) return;

      const citas = data.map((cita, i) => ({
        id: cita.id || i,
        fechaCita: cita.fechaCita,
        horaCita: cita.horaCita,
        motivo: cita.motivo,
        medico: cita.medico,

        pacienteNombre: cita.pacienteNombre,
        pacienteApellidoPaterno: cita.pacienteApellidoPaterno,
        pacienteApellidoMaterno: cita.pacienteApellidoMaterno,

        pacienteCurp: cita.curp,
        pacienteTelefono: cita.telefono,
        pacienteFechaNacimiento: cita.fechaNacimiento,
        pacienteEdad: calcularEdad(cita.fechaNacimiento),
      }));

      setAppointments(citas);
      setFilteredAppointments(citas);

    } catch (e) {
      console.error("❌ Error cargando citas:", e);
    }
  }, [idColaboradorReal]);

  useEffect(() => {
    if (idColaboradorReal) cargarCitas();
  }, [idColaboradorReal, cargarCitas]);

  // ===========================================
  // BUSCADOR
  // ===========================================
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);

    setFilteredAppointments(
      appointments.filter((cita) =>
        `${cita.pacienteNombre} ${cita.pacienteApellidoPaterno} ${cita.pacienteApellidoMaterno}`
          .toLowerCase()
          .includes(term)
      )
    );
  };

  // ===========================================
  // RELOJ
  // ===========================================
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setHoraActual(
        now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
      );
      setFechaActual(
        now.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ===========================================
  // ATENDER PACIENTE — OBJETO UNIFICADO Y PERFECTO
  // ===========================================
  const handleAtender = (cita) => {

    const pacienteData = {
      // Nombres
      nombre: cita.pacienteNombre,
      apellidoPaterno: cita.pacienteApellidoPaterno,
      apellidoMaterno: cita.pacienteApellidoMaterno,
      nombreCompleto: `${cita.pacienteNombre} ${cita.pacienteApellidoPaterno} ${cita.pacienteApellidoMaterno}`,

      // Identidad
      curp: cita.pacienteCurp,
      telefono: cita.pacienteTelefono,
      fechaNacimiento: cita.pacienteFechaNacimiento,
      edad: cita.pacienteEdad,

      // Cita
      motivo: cita.motivo,
      fechaCita: cita.fechaCita,
      horaCita: cita.horaCita,

      // Médico
      medico: cita.medico
    };

    navigate("/home-doctor/recetas", {
      state: { pacienteData },
    });
  };

  return (
    <div className={styles.mainLayout}>
      <div className={styles.contentArea}>
        <div className={styles.container}>

          {/* HEADER */}
          <header className={styles.header}>
            <img src={logo} className={styles.logo} alt="Logo" />

            <div className={styles.userInfo}>
              <span className={styles.userName}>
                <span className="material-icons">{Iconos.usuario}</span>
                {nombreUsuario}
              </span>

              <div className={styles.timeInfo}>
                <span className={styles.time}>
                  <span className="material-icons">{Iconos.reloj}</span> {horaActual}
                </span>

                <span className={styles.date}>
                  <span className="material-icons">{Iconos.calendario}</span> {fechaActual}
                </span>
              </div>
            </div>
          </header>

          {/* BUSCADOR */}
          <div className={styles.searchSection}>
            <div className={styles.searchBarWrapper}>
              <span className="material-icons">{Iconos.buscar}</span>
              <input
                className={styles.searchBar}
                type="text"
                placeholder="Buscar paciente..."
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* TITULO */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className="material-icons">{Iconos.citas}</span>
              Citas del Día
            </h2>
            <span className={styles.appointmentCount}>
              <span className="material-icons">{Iconos.evento}</span>
              {filteredAppointments.length} citas
            </span>
          </div>

          {/* TABLA */}
          <div className={styles.scrollContainer}>
            <table className={styles.citasTable}>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>CURP</th>
                  <th>Edad</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Motivo</th>
                  <th>Doctor</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((cita, i) => (
                    <tr key={i}>
                      <td>{cita.pacienteNombre} {cita.pacienteApellidoPaterno}</td>
                      <td>{cita.pacienteCurp}</td>
                      <td>{cita.pacienteEdad}</td>
                      <td>{new Date(cita.fechaCita).toLocaleDateString("es-MX")}</td>
                      <td>{cita.horaCita}</td>
                      <td>{cita.motivo}</td>
                      <td>{cita.medico}</td>
                      <td>
                        <button
                          className={styles.btnAtender}
                          onClick={() => handleAtender(cita)}
                        >
                          <span className="material-icons">{Iconos.atender}</span>
                          Atender
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className={styles.emptyRow}>No hay citas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
