import React, { useState } from "react";
import styles from "../../styles/pages/NurseHome.module.css";
import logo from "../../assets/logoLargo.png";

export default function NurseHome() {
  // ✅ ESTADOS (incluye showPatient y showMore)
  const [search, setSearch] = useState("");
  const [showPatient, setShowPatient] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showScheduleCard, setShowScheduleCard] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    doctor: "",
  });

  const fechaActual = new Date().toLocaleDateString("es-ES");

  const paciente = {
    nombre: "Jonathan Jahir Hernandez Velazquez",
    edad: 21,
    telefono: "55 1234 5678",
    correo: "jahir.hdz@example.com",
    direccion: "Calle San Pedro 123, Puebla, MX",
    ultimaConsulta: "15/09/2025",
    causa: "Infección de garganta",
    doctor: "Mario Ricardo Rosas Benítez",
    notas: "Paciente con historial de infecciones respiratorias leves.",
    consultasPrevias: ["9/08/2025", "12/07/2025", "7/06/2025", "15/09/2025"],
  };

  // ✅ Buscar por botón o Enter
  const handleSearch = () => {
    if (search.toLowerCase().includes("jahir")) {
      setShowPatient(true);
    } else {
      setShowPatient(false);
      setShowMore(false);
      setShowProfileCard(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // ✅ Agendar
  const handleAgendar = () => {
    if (!formData.fecha || !formData.hora || !formData.doctor) {
      alert("Por favor completa todos los campos.");
      return;
    }
    const nuevaCita = {
      paciente: "Jahir",
      edad: 21,
      fecha: formData.fecha,
      hora: formData.hora,
      doctor: formData.doctor,
    };
    setAppointments((prev) => [nuevaCita, ...prev]);
    setShowScheduleCard(false);
    setFormData({ fecha: "", hora: "", doctor: "" });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>
        <nav className={styles.navLinks}>
          <button className={styles.navButton}>
            <span className="material-icons">description</span> Historial clínico
          </button>
          <div className={styles.userBox}>
            <span className="material-icons">account_circle</span>
            <span>Toña Martínez</span>
          </div>
        </nav>
      </header>

      <hr className={styles.divider} />

      {/* Contenido */}
      <div className={styles.mainContent}>
        <div className={styles.searchRow}>
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="Buscar paciente"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPress}
              className={styles.searchInput}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
              <span className="material-icons">search</span>
            </button>
          </div>

          <button
            className={styles.scheduleButton}
            onClick={() => setShowScheduleCard(true)}
          >
            <span className="material-icons">event</span> Agendar
          </button>
        </div>

        {/* Citas de hoy */}
        <div className={styles.appointments}>
          <p>
            <strong>Citas de hoy:</strong> {fechaActual}
          </p>

          {appointments.length === 0 ? (
            <div className={styles.appointmentBox}></div>
          ) : (
            <div className={styles.appointmentList}>
              {appointments.map((cita, idx) => (
                <div key={idx} className={styles.appointmentItem}>
                  <p>
                    <strong>Paciente:</strong> {cita.paciente}, {cita.edad} años
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(cita.fecha).toLocaleDateString("es-ES")}
                  </p>
                  <p>
                    <strong>Hora:</strong> {cita.hora}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {cita.doctor}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Panel del paciente al encontrar */}
          {showPatient && (
            <>
              <div className={styles.patientBox}>
                <div className={styles.patientHeader}>
                  <span className={styles.patientName}>{paciente.nombre}</span>
                  <button
                    className={styles.profileButton}
                    onClick={() => setShowProfileCard(true)}
                  >
                    Perfil del paciente
                  </button>
                </div>

                <div className={styles.patientDetails}>
                  <p>
                    <strong>Última consulta:</strong> {paciente.ultimaConsulta}
                  </p>
                  <p>
                    <strong>Causa de consulta:</strong> {paciente.causa}
                  </p>
                  <p>
                    <strong>Doctor que atendió:</strong> {paciente.doctor}
                  </p>
                  <button className={styles.medButton}>Ver receta médica</button>
                </div>
              </div>

              <div className={styles.showMoreContainer}>
                <button
                  className={styles.showMoreButton}
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "Ver menos" : "Ver más"}
                </button>
              </div>

              {showMore && (
                <div className={styles.historyList}>
                  {paciente.consultasPrevias.map((fecha, idx) => (
                    <div key={idx} className={styles.historyItem}>
                      Consulta de: {fecha}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Card de perfil (superpuesta) */}
        {showProfileCard && (
          <div className={styles.profileOverlay}>
            <div className={styles.profileCard}>
              <div className={styles.profileCardHeader}>
                <h2>{paciente.nombre}</h2>
                <button
                  className={styles.closeProfileCard}
                  onClick={() => setShowProfileCard(false)}
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              <div className={styles.profileCardBody}>
                <div className={styles.profileInfoRow}>
                  <p>
                    <strong>Edad:</strong> {paciente.edad} años
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {paciente.telefono}
                  </p>
                </div>
                <p>
                  <strong>Correo:</strong> {paciente.correo}
                </p>
                <p>
                  <strong>Dirección:</strong> {paciente.direccion}
                </p>
                <p>
                  <strong>Notas médicas:</strong> {paciente.notas}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Card de agendar (superpuesta) */}
        {showScheduleCard && (
          <div className={styles.profileOverlay}>
            <div className={styles.scheduleCard}>
              <div className={styles.profileCardHeader}>
                <h2>Agendar cita</h2>
                <button
                  className={styles.closeProfileCard}
                  onClick={() => setShowScheduleCard(false)}
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              <div className={styles.scheduleBody}>
                <p>
                  <strong>Paciente:</strong> Jahir
                </p>
                <p>
                  <strong>Edad:</strong> 21 años
                </p>

                <label>Fecha:</label>
                <input
                  type="date"
                  className={styles.inputField}
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                />

                <label>Hora:</label>
                <select
                  className={styles.inputField}
                  value={formData.hora}
                  onChange={(e) =>
                    setFormData({ ...formData, hora: e.target.value })
                  }
                >
                  <option value="">Selecciona hora</option>
                  <option>8:00 am</option>
                  <option>9:00 am</option>
                  <option>10:00 am</option>
                </select>

                <label>Doctor:</label>
                <select
                  className={styles.inputField}
                  value={formData.doctor}
                  onChange={(e) =>
                    setFormData({ ...formData, doctor: e.target.value })
                  }
                >
                  <option value="">Selecciona doctor</option>
                  <option>Mario Ricardo</option>
                  <option>Rosa Benítez</option>
                  <option>Toña Martínez</option>
                </select>
              </div>

              <div className={styles.scheduleFooter}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowScheduleCard(false)}
                >
                  Cancelar
                </button>
                <button className={styles.confirmButton} onClick={handleAgendar}>
                  Agendar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
