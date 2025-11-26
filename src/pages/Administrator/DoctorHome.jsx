// DoctorHome.jsx
import React, { useState, useEffect } from "react";
import styles from "../../styles/pages/DoctorHome.module.css";
import logo from "../../assets/logoLargo.png";
import { useNavigate } from "react-router-dom";

export default function DoctorHome({ usuario }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [horaActual, setHoraActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");

  const [appointments] = useState([]); // Si luego conectas el backend, quedará listo.

  // ===============================
  // RELOJ EN VIVO
  // ===============================
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

  // ===============================
  // BUSCAR PACIENTE
  // ===============================
  const handleSearch = () => {
    alert("Buscando: " + search);
  };

  // ===============================
  // ATENDER PACIENTE
  // ===============================
  const handleAtender = (cita) => {
    navigate("/doctor/prescription", { state: { cita } });
  };

  return (
    <main className={styles.contentArea}>
      <div className={styles.container}>

        {/* ================= HEADER ================= */}
        <header className={styles.header}>
          <img src={logo} alt="Logo" className={styles.logo} />

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className={styles.userBox}>
              <span className="material-icons">account_circle</span>
              {usuario?.nombreUsuario || "Doctor"}
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

        {/* ================= BUSCADOR + BOTONES ================= */}
        <div className={styles.actionRow}>

          {/* === BUSCADOR === */}
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

          {/* === AGENDAR CITA === */}
          <button
            className={styles.scheduleButtonLarge}
            onClick={() => navigate("/home-doctor/citas")}
          >
            <span className="material-icons">event</span>
            Agendar cita
          </button>

          {/* === GENERAR RECETA === */}
          <button
            className={styles.scheduleButtonLarge}
            onClick={() => navigate("/home-doctor/recetas")}
          >
            <span className="material-icons">receipt_long</span>
            Recetas
          </button>
        </div>

        {/* ================= FECHA ================= */}
        <p style={{ fontWeight: 600, marginTop: "0.8rem" }}>
          Citas del doctor — <span>{fechaActual}</span>
        </p>

        {/* ================= TABLA DE CITAS ================= */}
        <div className={styles.tableContainer}>
          <table className={styles.citasTable}>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Edad</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Acciones</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {appointments.length > 0 ? (
                appointments.map((cita, i) => (
                  <tr key={i}>
                    <td>
                      {cita.nombre} {cita.apellidoPaterno} {cita.apellidoMaterno}
                    </td>
                    <td>{cita.edad}</td>
                    <td>{cita.fecha}</td>
                    <td>{cita.hora}</td>
                    <td>{cita.motivo}</td>
                    <td>{cita.doctor}</td>
                    <td>
                      <button
                        style={{
                          background: "#63b2a5",
                          color: "white",
                          border: "none",
                          padding: "0.3rem 0.8rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleAtender(cita)}
                      >
                        Atender
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "1rem" }}>
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
