// NurseHome.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/pages/NurseHome.module.css";
import SidebarMenu from "../../Components/SidebarMenu";
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

  // ============================
  // CARGAR USUARIO
  // ============================
  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));
  }, []);

  // ============================
  // RELOJ EN VIVO
  // ============================
  useEffect(() => {
    const updateClock = () => {
      setHoraActual(
        new Date().toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      let f = new Date().toLocaleDateString("es-MX", {
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

  // ============================
  // CARGAR TODAS LAS CITAS
  // ============================
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

  // ============================
  // BUSCAR POR CURP
  // ============================
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

  return (
    <div className={styles.mainLayout}>
      <SidebarMenu opcionesCustom={SidebarNurse} />

      <div className={styles.contentArea}>
        <div className={styles.container}>

          {/* ===========================
              HEADER
          ============================ */}
          <header className={styles.header}>
            <div className={styles.logoBox}>
              <img src={logo} alt="Logo" className={styles.logo} />
            </div>

            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {usuario?.nombreUsuario || "Enfermería"}
              </span>
              <div className={styles.timeInfo}>
                <span className={styles.time}>{horaActual}</span>
                <span className={styles.date}>{fechaActual}</span>
              </div>
            </div>
          </header>

          {/* ===========================
              BUSCADOR
          ============================ */}
          <div className={styles.searchSection}>
            <div className={styles.searchBarWrapper}>
              <span className="material-icons" style={{ fontSize: 22, color: "#999" }}>
                search
              </span>

              <input
                type="text"
                placeholder="Buscar paciente por CURP o correo..."
                value={curpBusqueda}
                onChange={(e) => setCurpBusqueda(e.target.value)}
                className={styles.searchBar}
              />

              <button
                className={styles.searchBtn}
                onClick={buscarCitasPorCurp}
              >
                <span className="material-icons">manage_search</span>
              </button>
            </div>

            <button
              className={styles.agendarBtn}
              onClick={() => navigate("/home-nurse/citas")}
            >
              <span className="material-icons">event</span>
              Agendar cita
            </button>
          </div>

          {/* ===========================
              TITULO Y CONTADOR
          ============================ */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Citas registradas</h2>

            <span className={styles.citaCount}>
              {citasPaciente.length} registros
            </span>
          </div>

          {/* ===========================
              TABLA
          ============================ */}
          <div className={styles.scrollContainer}>
            <div className={styles.tableWrapper}>
              <table className={styles.citasTable}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido paterno</th>
                    <th>Apellido materno</th>
                    <th>CURP</th>
                    <th>Fecha y hora</th>
                    <th>Doctor</th>
                  </tr>
                </thead>

                <tbody>
                  {citasPaciente.length > 0 ? (
                    citasPaciente.map((cita, i) => (
                      <tr key={i}>
                        <td>{cita.nombre}</td>
                        <td>{cita.apellidoPaterno}</td>
                        <td>{cita.apellidoMaterno}</td>
                        <td>{cita.curp}</td>
                        <td>
                          {cita.fechaCita?.split("T")[0]}{" "}
                          {cita.horaCita && ` - ${cita.horaCita}`}
                        </td>
                        <td>{cita.medico}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className={styles.emptyRow}>
                        <div className={styles.emptyState}>
                          <span className="material-icons" style={{ fontSize: 40 }}>
                            hourglass_empty
                          </span>
                          <p>No hay citas para mostrar</p>
                          <small>Realiza una búsqueda para ver resultados</small>
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
  );
}
