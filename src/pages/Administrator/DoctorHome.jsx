import React, { useState, useEffect } from "react";
import styles from "../../styles/pages/DoctorHome.module.css";
import logo from "../../assets/logoLargo.png";
import { useNavigate } from "react-router-dom";
import { getCitasDeColaborador } from "../../Api/colaborator";

// Importar Material Icons
import "material-icons/iconfont/material-icons.css";

export default function DoctorHome() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [horaActual, setHoraActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

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
      setFilteredAppointments(citasFormateadas);
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
      const f = new Date().toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setFechaActual(f.charAt(0).toUpperCase() + f.slice(1));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (idColaborador) cargarCitas();
  }, [idColaborador]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter((cita) => {
        const nombreCompleto = `${cita.nombre} ${cita.apellidoPaterno} ${cita.apellidoMaterno}`.toLowerCase();
        return nombreCompleto.includes(value.toLowerCase());
      });
      setFilteredAppointments(filtered);
    }
  };

  const handleAtender = (cita) => {
    navigate("/home-doctor/recetas", { state: { cita } });
  };

  return (
    <div className={styles.mainLayout}>
      <div className={styles.contentArea}>
        <div className={styles.container}>

          {/* HEADER */}
          <header className={styles.header}>
            <div className={styles.logoBox}>
              <img src={logo} alt="Logo" className={styles.logo} />
            </div>

            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {nombreUsuario}
              </span>
              <div className={styles.timeInfo}>
                <span className={styles.time}>{horaActual}</span>
                <span className={styles.date}>{fechaActual}</span>
              </div>
            </div>
          </header>

          {/* BUSCADOR */}
          {/* BUSCADOR (estilo igual que NurseHome) */}
<div className={styles.searchSection}>
  <div className={styles.searchBarWrapper}>
    <span className="material-icons" style={{ fontSize: 22, color: "#999" }}>
      search
    </span>

    <input
      type="text"
      className={styles.searchBar}
      placeholder="Buscar paciente por nombre..."
      value={search}
      onChange={handleSearch}
    />

    {search.trim() !== "" && (
      <button
        className={styles.clearBtn}
        onClick={() => {
          setSearch("");
          setFilteredAppointments(appointments);
        }}
      >
        <span className="material-icons">close</span>
      </button>
    )}
  </div>
</div>


          {/* TITLE + COUNT */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Citas del Día</h2>

            <span className={styles.appointmentCount}>
              {filteredAppointments.length} {filteredAppointments.length === 1 ? "cita" : "citas"}
            </span>
          </div>

          {/* TABLA */}
          <div className={styles.scrollContainer}>
            <div className={styles.tableWrapper}>
              <div className={styles.tableContainer}>
                <table className={styles.citasTable}>
                  <thead>
                    <tr>
                      <th>
                        <span className="material-icons" style={{ fontSize: 18 }}>person</span>
                        Paciente
                      </th>
                      <th>Edad</th>
                      <th>
                        <span className="material-icons" style={{ fontSize: 18 }}>event</span>
                        Fecha
                      </th>
                      <th>
                        <span className="material-icons" style={{ fontSize: 18 }}>schedule</span>
                        Hora
                      </th>
                      <th>Motivo</th>
                      <th>Doctor</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((cita, i) => (
                        <tr key={i} className={styles.tableRow}>
                          <td className={styles.patientCell}>
                            {cita.nombre} {cita.apellidoPaterno} {cita.apellidoMaterno}
                          </td>

                          <td>{cita.edad} años</td>

                          <td>{cita.fecha}</td>

                          <td>{cita.hora}</td>

                          <td>{cita.motivo}</td>

                          <td>{cita.doctor}</td>

                          <td>
                            <button
                              className={styles.btnAtender}
                              onClick={() => handleAtender(cita.citaOriginal)}
                            >
                              <span className="material-icons" style={{ fontSize: 20 }}>
                                medical_services
                              </span>
                              Atender
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className={styles.emptyRow}>
                          <div className={styles.emptyState}>
                            <span className="material-icons" style={{ fontSize: 40, color: "#ccc" }}>
                              hourglass_empty
                            </span>
                            <p>No hay citas programadas</p>
                            <small>Las citas aparecerán cuando se agenden</small>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
