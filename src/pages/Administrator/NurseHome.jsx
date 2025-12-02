// NurseHome.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/pages/NurseHome.module.css";
import SidebarMenu from "../../Components/SidebarMenu";
import logo from "../../assets/logoLargo.png";

import { getCitasPacienteByCurpOrEmail } from "../../Api/colaborator";
import { getAllCitas } from "../../Api/cita";

import { SidebarNurse } from "../../Config/sidebars";
import SignosVitalesModal from "../../Components/modals/SignosVitalesModal";

export default function NurseHome() {
  const [usuario, setUsuario] = useState(null);
  const [curpBusqueda, setCurpBusqueda] = useState("");
  const [citasPaciente, setCitasPaciente] = useState([]);

  const [horaActual, setHoraActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");
  const [modalPaciente, setModalPaciente] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  // ---------------------- Cargar enfermera ----------------------
  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));
  }, []);

  // ---------------------- Reloj ----------------------
  useEffect(() => {
    const updateClock = () => {
      setHoraActual(
        new Date().toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      let f = new Date().toLocaleDateString("es-MX", {
        weekday: "long",
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

  // ---------------------- Cargar citas ----------------------
  useEffect(() => {
    cargarTodasLasCitas();
  }, []);

  const cargarTodasLasCitas = async () => {
    try {
      const citas = await getAllCitas();
      setCitasPaciente(citas);
      setCurrentPage(1);
    } catch {
      alert("Error cargando las citas.");
    }
  };

  // ---------------------- Búsqueda ----------------------
  const buscarCitasPorCurp = async () => {
    if (!curpBusqueda.trim()) return cargarTodasLasCitas();

    try {
      const citas = await getCitasPacienteByCurpOrEmail(curpBusqueda);

      if (!citas || citas.length === 0) {
        alert("Este paciente no tiene citas registradas.");
        setCitasPaciente([]);
        return;
      }

      setCitasPaciente(citas);
      setCurrentPage(1);
    } catch {
      alert("No se encontró información para ese CURP/correo.");
      setCitasPaciente([]);
    }
  };

  // ---------------------- Ordenar citas: las atendidas al final ----------------------
  const citasOrdenadas = [...citasPaciente].sort((a, b) => {
    const aAt = a.atendida ? 1 : 0;
    const bAt = b.atendida ? 1 : 0;
    return aAt - bAt; // 0 antes que 1
  });

  // ---------------------- Paginación ----------------------
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = citasOrdenadas.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(
    1,
    Math.ceil(citasOrdenadas.length / rowsPerPage)
  );

  // ---------------------- Render ----------------------
  return (
    <div className={styles.mainLayout}>
      <SidebarMenu opcionesCustom={SidebarNurse} />

      <div className={styles.contentArea}>
        <div className={styles.container}>

          {/* HEADER */}
          <header className={styles.header}>
            <div className={styles.logoBox}>
              <img src={logo} alt="Logo" className={styles.logo} />
            </div>

            <div className={styles.userInfo}>
              <div className={styles.userName}>
                <span className="material-icons-outlined">account_circle</span>
                {usuario?.nombreUsuario || "Enfermería"}
              </div>

              <div className={styles.timeInfo}>
                <div className={styles.time}>
                  <span className="material-icons-outlined">schedule</span>
                  {horaActual}
                </div>

                <div className={styles.date}>
                  <span className="material-icons-outlined">calendar_today</span>
                  {fechaActual}
                </div>
              </div>
            </div>
          </header>

          {/* BUSCADOR */}
          <div className={styles.searchSection}>
            <div className={styles.searchBarWrapper}>
              <span className="material-icons-outlined">search</span>

              <input
                type="text"
                placeholder="Buscar por CURP o correo..."
                value={curpBusqueda}
                onChange={(e) => setCurpBusqueda(e.target.value)}
                className={styles.searchBar}
              />

              <button className={styles.searchBtn} onClick={buscarCitasPorCurp}>
                <span className="material-icons-outlined">manage_search</span>
              </button>
            </div>

            <button
              className={styles.agendarBtn}
              onClick={() => navigate("/home-nurse/citas")}
            >
              <span className="material-icons-outlined">event</span>
              Agendar cita
            </button>
          </div>

          {/* TABLA */}
          <div className={styles.scrollContainer}>
            <table className={styles.citasTable}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido paterno</th>
                  <th>Apellido materno</th>
                  <th>CURP</th>
                  <th>Fecha y hora</th>
                  <th>Doctor</th>
                  <th className={styles.centerCol}>Atender</th>
                </tr>
              </thead>

              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((cita, i) => (
                    <tr
                      key={i}
                      className={`${styles.tableRow} ${
                        cita.atendida ? styles.rowAtendida : ""
                      }`}
                    >
                      <td>{cita.pacienteNombre}</td>
                      <td>{cita.pacienteApellidoPaterno}</td>
                      <td>{cita.pacienteApellidoMaterno}</td>
                      <td>{cita.curp}</td>
                      <td>
                        {cita.fechaCita?.split("T")[0]}{" "}
                        {cita.horaCita ? `- ${cita.horaCita}` : ""}
                      </td>
                      <td>{cita.medico}</td>

                      <td className={styles.centerCol}>
                        <button
                          className={styles.vitalsBtn}
                          disabled={cita.atendida}
                          onClick={() =>
                            setModalPaciente({
                              ...cita, // enviamos la cita completa
                              nombreCompleto: `${cita.pacienteNombre} ${cita.pacienteApellidoPaterno} ${cita.pacienteApellidoMaterno}`,
                            })
                          }
                        >
                          <span className="material-icons-outlined">monitor_heart</span>
                          Signos Vitales
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      <div className={styles.emptyState}>
                        <span
                          className="material-icons-outlined"
                          style={{ fontSize: 40 }}
                        >
                          hourglass_empty
                        </span>
                        <p>No hay citas para mostrar</p>
                        <small>Realiza una búsqueda o registra una cita</small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* PAGINACIÓN */}
            {citasOrdenadas.length > 0 && (
              <div className={styles.paginationTable}>
                <div className={styles.rowsSelectorTable}>
                  <label>Filas:</label>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {[5, 10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.pageControlsTable}>
                  <button
                    className={styles.paginationBtn}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <span className="material-icons-outlined">chevron_left</span>
                  </button>

                  <span className={styles.pageInfoTable}>
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    className={styles.paginationBtn}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    <span className="material-icons-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL SIGNOS VITALES */}
      {modalPaciente && (
        <SignosVitalesModal
          paciente={modalPaciente}
          onClose={() => setModalPaciente(null)}
          onSave={() => {
            // 🔥 Marcar SOLO esta cita con fecha y hora exactas
            setCitasPaciente((prev) =>
              prev.map((c) =>
                c.curp === modalPaciente.curp &&
                c.fechaCita === modalPaciente.fechaCita &&
                c.horaCita === modalPaciente.horaCita
                  ? { ...c, atendida: true }
                  : c
              )
            );
          }}
        />
      )}
    </div>
  );
}
