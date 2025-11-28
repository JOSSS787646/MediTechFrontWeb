// StartHome.jsx
import React, { useEffect, useState } from "react";
import styles from "../../styles/pages/StartHome.module.css";
import logoLargo from "../../assets/logoLargo.png";

export default function StartHome({ usuario }) {
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

  const nombreCompleto =
    usuario?.nombre || usuario?.nombreUsuario || "Administrador";

  return (
    <div className={styles.wrapper}>

      {/* 🔥 ENCABEZADO UNIFICADO */}
      <header className={styles.headerSticky}>
        <div className={styles.logoBox}>
          <img src={logoLargo} alt="Logo" className={styles.logo} />
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userName}>
            <span className="material-icons">account_circle</span>
            {nombreCompleto}
          </div>

          <div className={styles.timeInfo}>
            <div className={styles.time}>
              <span className="material-icons">schedule</span>
              {hora}
            </div>
            <div className={styles.date}>
              <span className="material-icons">calendar_today</span>
              {fecha}
            </div>
          </div>
        </div>
      </header>

      {/* 🟦 Bienvenida */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.saludo}>
            Hola, <span>{nombreCompleto}</span>
          </h1>
          <p className={styles.descripcion}>
            Bienvenido al panel administrativo — gestione, supervise y mantenga el control
            de su institución médica.
          </p>
        </div>
      </header>

      {/* 🟩 Card informativa */}
      <section className={styles.infoCard}>
        <img src={logoLargo} alt="MediTech logo" className={styles.logoInfo} />
        <div>
          <h2>Centro de Control Administrativo</h2>
          <p>
            Optimice procesos, centralice datos y mejore la experiencia del personal
            médico desde un solo panel.
          </p>
        </div>
      </section>
    </div>
  );
}
