import React, { useEffect, useState } from "react";
import styles from "../../styles/pages/StartHome.module.css";
import logo from "../../assets/logo.png";

export default function StartHome() {
  const [hora, setHora] = useState("");
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    const actualizarFechaHora = () => {
      const now = new Date();
      const opcionesFecha = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setFecha(now.toLocaleDateString("es-ES", opcionesFecha));
      setHora(
        now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    actualizarFechaHora();
    const timer = setInterval(actualizarFechaHora, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      {/* 🔹 Barra superior */}
      <div className={styles.topBar}>
        <button className={styles.registerButton}>
          <span className="material-icons">person_add</span>
          <span>Registrar Usuarios</span>
        </button>

        <div className={styles.userBox}>
          <span className="material-icons">account_circle</span>
          <span>Jahir Hernandez</span>
        </div>
      </div>

      {/* Línea decorativa */}
      <div className={styles.divider}></div>

      {/* 🔹 Contenido principal */}
      <div className={styles.headerSection}>
        <div className={styles.timeBox}>
          <h2>{hora}</h2>
          <p>{fecha}</p>
        </div>
        <div className={styles.welcomeBox}>
          <h1>¡Bienvenido de nuevo, Jahir!</h1>
          <p>Gestiona usuarios y pacientes desde este panel.</p>
        </div>
      </div>

      <div className={styles.cardsContainer}>
        <div className={`${styles.card} ${styles.cardTeal}`}>
          <span className="material-icons">group</span>
          <h3>Usuarios Registrados</h3>
          <p>Administra fácilmente los colaboradores del sistema.</p>
        </div>

        <div className={`${styles.card} ${styles.cardTeal}`}>
          <span className="material-icons">medical_services</span>
          <h3>Pacientes</h3>
          <p>Accede rápidamente al historial y datos médicos.</p>
        </div>
      </div>

      <div className={styles.logoSection}>
        <img src={logo} alt="MediTech logo" />
      </div>
    </div>
  );
}
