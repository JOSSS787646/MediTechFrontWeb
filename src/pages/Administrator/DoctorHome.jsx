import React, { useState, useEffect } from "react";
import styles from "../../styles/pages/DoctorHome.module.css";
import logo from "../../assets/logoLargo.png";
import { useNavigate } from "react-router-dom";
import { getCitasDeColaborador } from "../../Api/colaborator";

export default function DoctorHome() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [horaActual, setHoraActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");
  const [appointments, setAppointments] = useState([]);

  const [idColaborador, setIdColaborador] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState("Doctor");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuario"));
    if (u) {
      setIdColaborador(u.id);
      setNombreUsuario(u.nombreUsuario || "Doctor");
    }
  }, []);

  const cargarCitas = async () => {
    try {
      const response = await getCitasDeColaborador(idColaborador);
      if (!Array.isArray(response)) return;

      const citasFormateadas = response.map((c) => ({
        nombre: c.pacienteNombre,
        apellidoPaterno: c.pacienteApellidoPaterno,
        apellidoMaterno: c.pacienteApellidoMaterno,
        fecha: new Date(c.fechaCita).toLocaleDateString("es-MX"),
        hora: c.horaCita,
        motivo: c.motivo,
        doctor: c.medico,
        edad: calcularEdad(c.fechaNacimiento),
        citaOriginal: c,
      }));

      setAppointments(citasFormateadas);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    }
  };

  const calcularEdad = (fecha) => {
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  useEffect(() => {
    const updateClock = () => {
      setHoraActual(
        new Date().toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setFechaActual(
        new Date().toLocaleDateString("es-MX", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (idColaborador) cargarCitas();
  }, [idColaborador]);

  const handleSearch = () => {
    alert("Buscando: " + search);
  };

  const handleAtender = (cita) => {
    navigate("/doctor/prescription", { state: { cita } });
  };

  return (
    <main className={styles.contentArea}>
      <div className={styles.container}>

        <header className={styles.header}>
          <img src={logo} alt="Logo" className={styles.logo} />

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className={styles.userBox}>
              <span className="material-icons">account_circle</span>
              {nombreUsuario}
            </div>

            <div className={styles.clockBox}>
              <div className={styles.clockRow}>
                <span className="material-icons">schedule</span>
                <span className={styles.time}>{horaActual}</span>
              </div>
              <span className={styles.date}>{fechaActual}</span>
            </div>
          </div>
        </header>

        <hr className={styles.divider} />

        {/* BUSCADOR */}
        <div className={styles.actionRow}>
          <div className={styles.searchSection}>
            <div className={styles.searchBarWrapper}>
              <input
                type="text"
                placeholder="Buscar paciente"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchBar}
              />
              <button className={styles.searchIconBtn} onClick={handleSearch}>
                <span className="material-icons">search</span>
              </button>
            </div>
          </div>

          <button
            className={styles.scheduleButtonLarge}
            onClick={() => navigate("/home-doctor/citas")}
          >
            <span className="material-icons">event</span>
            Agendar cita
          </button>

          <button
            className={styles.scheduleButtonLarge}
            onClick={() => navigate("/home-doctor/recetas")}
          >
            <span className="material-icons">receipt_long</span>
            Recetas
          </button>
        </div>

        <p className={styles.sectionTitle}>
          Citas del doctor — <span>{fechaActual}</span>
        </p>

        {/* TABLA */}
        <div className={styles.tableContainer}>
          <table className={styles.citasTable}>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Edad</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Doctor</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length > 0 ? (
                appointments.map((cita, i) => (
                  <tr key={i}>
                    <td>{cita.nombre} {cita.apellidoPaterno} {cita.apellidoMaterno}</td>
                    <td>{cita.edad}</td>
                    <td>{cita.fecha}</td>
                    <td>{cita.hora}</td>
                    <td>{cita.motivo}</td>
                    <td>{cita.doctor}</td>
                    <td>
                      <button
                        className={styles.btnAtender}
                        onClick={() => handleAtender(cita.citaOriginal)}
                      >
                        <span className="material-icons">medical_services</span>
                        Atender
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.emptyRow}>
                    No hay citas programadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
