// NurseHome.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "../../Components/SidebarMenu";
import styles from "../../styles/pages/NurseHome.module.css";
import logo from "../../assets/logoLargo.png";

import {
  getCitasPacienteByCurpOrEmail,
  getAllCitasPacientes,
} from "../../Api/colaborator";

import { SidebarNurse } from "../../Config/sidebars";

export default function NurseHome() {
  const [usuario, setUsuario] = useState(null);
  const [curpBusqueda, setCurpBusqueda] = useState("");
  const [citasPaciente, setCitasPaciente] = useState([]);

  const [horaActual, setHoraActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");

  const navigate = useNavigate();

  // =========================
  // CARGAR USUARIO
  // =========================
  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));
  }, []);

  // =========================
  // RELOJ EN VIVO ⏰
  // =========================
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

  // =========================
  // CARGAR TODAS LAS CITAS
  // =========================
  useEffect(() => {
    cargarTodasLasCitas();
  }, []);

  const cargarTodasLasCitas = async () => {
    try {
      const citas = await getAllCitasPacientes();
      setCitasPaciente(citas);
    } catch {
      alert("Error cargando todas las citas.");
    }
  };

  // =========================
  // BUSCAR CITAS POR CURP
  // =========================
  const buscarCitasPorCurp = async () => {
    if (!curpBusqueda.trim()) {
      cargarTodasLasCitas();
      return;
    }

    try {
      const citas = await getCitasPacienteByCurpOrEmail(curpBusqueda);

      if (!citas || citas.length === 0) {
        alert("Este paciente no tiene citas registradas.");
        setCitasPaciente([]);
        return;
      }

      setCitasPaciente(citas);
    } catch {
      alert("No se encontró información para ese CURP.");
      setCitasPaciente([]);
    }
  };

  const fechaHoy = new Date().toLocaleDateString("es-MX");

  return (
    <div className={styles.mainLayout}>
      <SidebarMenu opcionesCustom={SidebarNurse} passObject={true} />

      <main className={styles.contentArea}>
        <div className={styles.container}>

          {/* HEADER */}
          <header className={styles.header}>
            <img src={logo} alt="Logo" className={styles.logo} />

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              
              {/* Usuario */}
              <div className={styles.userBox}>
                <span className="material-icons">account_circle</span>
                {usuario?.nombreUsuario || "Enfermera"}
              </div>

              {/* Reloj */}
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

          {/* FILA: BUSCADOR + AGENDAR */}
          <div className={styles.actionRow}>

            <div className={styles.searchSection}>
              <div className={styles.searchBarWrapper}>
                <input
                  type="text"
                  placeholder="Buscar paciente por CURP"
                  value={curpBusqueda}
                  onChange={(e) => setCurpBusqueda(e.target.value)}
                  className={styles.searchBar}
                />
                <button
                  className={styles.searchIconBtn}
                  onClick={buscarCitasPorCurp}
                >
                  <span className="material-icons">search</span>
                </button>
              </div>
            </div>

            <button
              className={styles.scheduleButtonLarge}
              onClick={() => navigate("/home-nurse/citas")}
            >
              <span className="material-icons">event</span>
              Agendar cita
            </button>

          </div>

          {/* Texto de fecha */}
          <p style={{ fontWeight: 600, marginTop: "0.8rem" }}>
            Citas de hoy: <span>{fechaHoy}</span>
          </p>

          {/* TABLA */}
          <div className={styles.tableContainer}>
            <table className={styles.citasTable}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido Paterno</th>
                  <th>Apellido Materno</th>
                  <th>CURP</th>
                  <th>Fecha y hora</th>
                  <th>Doctor</th>
                </tr>
              </thead>

              <tbody>
                {citasPaciente.length > 0 ? (
                  citasPaciente.map((cita) => (
                    <tr key={cita.id}>
                      <td>{cita.nombre}</td>
                      <td>{cita.apellidoPaterno}</td>
                      <td>{cita.apellidoMaterno}</td>
                      <td>{cita.curp}</td>
                      <td>
                        {cita.fechaCita?.split("T")[0]}{" "}
                        {cita.horaCita && ` - ${cita.horaCita}`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
                      No hay resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}
