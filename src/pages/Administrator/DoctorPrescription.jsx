import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarMenu from "../../Components/SidebarMenu";
import layout from "../../styles/pages/HomeAdministrador.module.css";
import styles from "../../styles/pages/DoctorHome.module.css";
import logo from "../../assets/logoLargo.png";

export default function DoctorPrescription() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cita = state?.cita;

  // ✅ Estado de tiempo y tratamiento
  const [horaActual, setHoraActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");
  const [tratamiento, setTratamiento] = useState("");

  // 🕒 Actualiza la hora cada minuto
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

  // 🔙 Regresar al home de doctores
  const handleBack = () => {
    navigate("/home/doctores");
  };

  if (!cita)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        No hay datos de la cita.
      </p>
    );

  return (
    <div className={layout.container}>
      {/* ===== SIDEBAR ===== */}
      <SidebarMenu activeDefault="Doctores" />

      {/* ===== CONTENIDO ===== */}
      <main className={layout.mainContent}>
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

              {/* 🔙 Botón Regresar */}
              <button className={styles.backButton} onClick={handleBack}>
                <span className="material-icons">arrow_back</span>
                Regresar
              </button>

              <div className={styles.userBox}>
                <span className="material-icons">account_circle</span>
                <span>{cita.doctor}</span>
              </div>
            </nav>
          </header>

          <hr className={styles.divider} />

          {/* ===== CARD DE RECETA ===== */}
          <div className={styles.prescriptionContainer}>
            <div className={styles.profileCard}>
              <div className={styles.profileCardHeader}>
                <h2>Receta Médica</h2>
              </div>

              <div className={styles.profileCardBody}>
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
                <p>
                  <strong>Paciente:</strong> {cita.paciente}{" "}
                  {cita.apellidoPaterno} {cita.apellidoMaterno}
                </p>
                <p>
                  <strong>Edad:</strong> {cita.edad} años
                </p>
                <p>
                  <strong>Motivo:</strong> {cita.motivo}
                </p>

                <label>
                  <strong>Tratamiento:</strong>
                </label>
                <textarea
                  className={styles.textArea}
                  placeholder="Escribe el medicamento o tratamiento..."
                  value={tratamiento}
                  onChange={(e) => setTratamiento(e.target.value)}
                ></textarea>

                <div className={styles.footerButtons}>
                  <button
                    className={styles.cancelButton}
                    onClick={handleBack}
                  >
                    Cancelar
                  </button>
                  <button className={styles.confirmButton}>
                    Guardar receta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
