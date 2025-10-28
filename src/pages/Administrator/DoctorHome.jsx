import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/pages/DoctorHome.module.css";
import logo from "../../assets/logoLargo.png";

export default function DoctorHome() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [horaActual, setHoraActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");
  const [showScheduleCard, setShowScheduleCard] = useState(false);

  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    doctor: "",
  });

  // 🕒 Actualiza fecha y hora
  useEffect(() => {
    const updateTime = () => {
      setHoraActual(
        new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setFechaActual(
        new Date().toLocaleDateString("es-ES", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // 🧍 Datos de ejemplo
  const paciente = {
    nombre: "Jonathan Jahir",
    apellidoPaterno: "Hernández",
    apellidoMaterno: "Velázquez",
    edad: 21,
    motivo: "Dolor de garganta",
  };

  // 🔍 Buscar paciente
  const handleSearch = () => {
    console.log("Buscando paciente:", search);
  };

  // 📅 Agendar nueva cita
  const handleAgendar = () => {
    if (!formData.fecha || !formData.hora || !formData.doctor) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nuevaCita = {
      paciente: paciente.nombre,
      apellidoPaterno: paciente.apellidoPaterno,
      apellidoMaterno: paciente.apellidoMaterno,
      edad: paciente.edad,
      fecha: formData.fecha,
      hora: formData.hora,
      motivo: paciente.motivo,
      doctor: formData.doctor,
    };
    setAppointments((prev) => [nuevaCita, ...prev]);
    setFormData({ fecha: "", hora: "", doctor: "" });
    setShowScheduleCard(false);
  };

  // 🩺 Ir a vista de receta
  const handleAtender = (cita) => {
    navigate("/doctor/prescription", { state: { cita } });

  };

  return (
    <div className={`${styles.container} ${styles.doctorTheme}`}>
      {/* ===== HEADER ===== */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>

        <nav className={styles.navLinks}>
          <div className={styles.clockBox}>
            <div className={styles.clockRow}>
              <span className="material-icons">schedule</span>
              <span className={styles.time}>{horaActual}</span>
            </div>
            <span className={styles.date}>{fechaActual}</span>
          </div>

          <div className={styles.userBox}>
            <span className="material-icons">account_circle</span>
            <span>Dr. Mario Ricardo Rosas</span>
          </div>
        </nav>
      </header>

      <hr className={styles.divider} />

      {/* ===== CONTENIDO ===== */}
      <div className={styles.mainContent}>
        {/* 🔍 Buscador y botón Agendar */}
        <div className={styles.searchRow}>
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="Buscar paciente"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

        {/* ===== CITAS ===== */}
        <div className={styles.appointments}>
          <p>
            <strong>Citas de hoy:</strong>{" "}
            {new Date().toLocaleDateString("es-ES")}
          </p>

          {appointments.length === 0 ? (
            <div className={styles.appointmentBox}>
              No hay citas registradas.
            </div>
          ) : (
            <div className={styles.appointmentList}>
              {appointments.map((cita, idx) => (
                <div key={idx} className={styles.appointmentItem}>
                  <p>
                    <strong>Paciente:</strong> {cita.paciente}{" "}
                    {cita.apellidoPaterno} {cita.apellidoMaterno}
                  </p>
                  <p>
                    <strong>Edad:</strong> {cita.edad} años
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(cita.fecha).toLocaleDateString("es-ES")}
                  </p>
                  <p>
                    <strong>Hora:</strong> {cita.hora}
                  </p>
                  <p>
                    <strong>Motivo:</strong> {cita.motivo}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {cita.doctor}
                  </p>

                  <button
                    className={styles.attendButton}
                    onClick={() => handleAtender(cita)}
                  >
                    <span className="material-icons">medical_services</span>
                    Atender
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== CARD PARA AGENDAR ===== */}
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
                <p><strong>Paciente:</strong> {paciente.nombre}</p>
                <p><strong>Edad:</strong> {paciente.edad} años</p>

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
                  <option>11:00 am</option>
                  <option>12:00 pm</option>
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
                  <option>Dr. Mario Ricardo</option>
                  <option>Dra. Rosa Benítez</option>
                  <option>Dra. Toña Martínez</option>
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
