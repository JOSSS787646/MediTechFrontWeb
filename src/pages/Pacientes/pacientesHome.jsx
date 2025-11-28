// PacientesHome.jsx
import React, { useState, useEffect } from "react";
import styles from "../../styles/pages/UsersHome.module.css";
import SidebarMenu from "../../Components/SidebarMenu";
import RegisterPacienteModal from "../../Components/modals/RegisterPacienteModal";
import { getPacientes } from "../../Api/paciente";
import { SidebarAdmin, SidebarNurse, SidebarDoctor } from "../../Config/sidebars";
import logo from "../../assets/logoLargo.png";

export default function PacientesHome() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [, setSeccion] = useState("Pacientes");
  const [usuario, setUsuario] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  /* ----------------------------- RELOJ ----------------------------- */
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ----------------------------- USUARIO ----------------------------- */
  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      const parsed = JSON.parse(userData);
      parsed.tipoColaborador = parsed.tipoColaborador?.toLowerCase();
      setUsuario(parsed);
    }
  }, []);

  const getOpcionesSidebar = () => {
    if (!usuario) return [];
    const tipo = usuario.tipoColaborador;

    if (["admin", "administrador", "3"].includes(tipo)) return SidebarAdmin;
    if (["enfermera", "2"].includes(tipo)) return SidebarNurse;
    return SidebarDoctor;
  };

  const opcionesSidebar = getOpcionesSidebar();

  /* ----------------------------- CARGAR PACIENTES ----------------------------- */
  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const lista = await getPacientes();
      const activos = (lista || []).filter((p) => p.esActivo);
      setData(activos);
      setFilteredData(activos);
    } catch (error) {
      console.error("❌ Error al obtener pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  /* ----------------------------- FILTRO ----------------------------- */
  useEffect(() => {
    const filtered = data.filter((p) => {
      const nombre = `${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}`.toLowerCase();
      return nombre.includes(searchTerm.toLowerCase());
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const formatTime = (date) =>
    date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date) =>
    date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  /* ----------------------------- PAGINACIÓN ----------------------------- */
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  return (
    <div className={styles.mainLayout}>
      {/* Sidebar solo si no es admin */}
      {usuario && usuario.tipoColaborador !== "3" && (
        <SidebarMenu
          setSeccion={setSeccion}
          seccionActiva="Pacientes"
          opcionesCustom={opcionesSidebar}
          passObject={true}
        />
      )}

      <div className={styles.contentArea}>
        {/* HEADER FIJO */}
        <header className={styles.headerSticky}>
          <div className={styles.logoBox}>
            <img src={logo} alt="Logo" className={styles.logo} />
          </div>

          <div className={styles.userInfo}>
            <div className={styles.userName}>
              <span className="material-icons">account_circle</span>
              {usuario?.nombreUsuario || "Usuario"}
            </div>

            <div className={styles.timeInfo}>
              <div className={styles.time}>
                <span className="material-icons">schedule</span>
                {formatTime(currentTime)}
              </div>
              <div className={styles.date}>
                <span className="material-icons">calendar_today</span>
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <div className={styles.scrollContainer}>
          <div className={styles.container}>
            {/* ENCABEZADO DE SECCIÓN */}
            <section className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <span className="material-icons">people</span>
                Administrar Pacientes
              </div>
              
              <div className={styles.headerActions}>
                <div className={styles.appointmentCount}>
                  <span className="material-icons">person</span>
                  {loading ? "Cargando..." : `${filteredData.length} Pacientes`}
                </div>

                <button
                  className={styles.btnAtender}
                  onClick={() => setShowRegisterModal(true)}
                >
                  <span className="material-icons">person_add</span>
                  Registrar Paciente
                </button>
              </div>
            </section>

            {/* BUSCADOR */}
            <section className={styles.searchSection}>
              <div className={styles.searchBarCompact}>
                <span className="material-icons">search</span>
                <input
                  type="text"
                  placeholder="Buscar paciente por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
              </div>
            </section>

            {/* TABLA SCROLLEABLE */}
            <div className={styles.tableScroll}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}>
                    <span className="material-icons">refresh</span>
                  </div>
                  <p className={styles.loadingText}>Cargando pacientes...</p>
                  <p className={styles.loadingSubtext}>Por favor espere</p>
                </div>
              ) : (
                <TablaPacientes currentRows={currentRows} />
              )}
            </div>

            {/* PAGINACIÓN */}
            {!loading && (
              <Paginacion
                filteredData={filteredData}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            )}

            {/* MODAL REGISTRO */}
            {showRegisterModal && (
              <RegisterPacienteModal
                onClose={() => setShowRegisterModal(false)}
                onSave={fetchPacientes}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   TABLA DE PACIENTES
================================================================ */
function TablaPacientes({ currentRows }) {
  const calcularEdad = (fecha) => {
    if (!fecha) return "N/A";
    const n = new Date(fecha);
    const h = new Date();
    let edad = h.getFullYear() - n.getFullYear();
    const m = h.getMonth() - n.getMonth();
    if (m < 0 || (m === 0 && h.getDate() < n.getDate())) edad--;
    return `${edad} años`;
  };

  const formatearGenero = (genero) => {
    if (!genero) return "No especificado";
    const g = genero.toLowerCase();
    if (g.startsWith("m")) return "Masculino";
    if (g.startsWith("f")) return "Femenino";
    return genero;
  };

  return (
    <table className={styles.citasTable}>
      <thead>
        <tr>
          <th>

            Nombre Completo
          </th>
          <th>
         
            Edad
          </th>
          <th>
        
            CURP
          </th>
          <th>
       
            Email
          </th>
          <th>
       
            Teléfono
          </th>
          <th>

            Género
          </th>
        </tr>
      </thead>

      <tbody>
        {currentRows.length === 0 ? (
          <tr className={styles.emptyRow}>
            <td colSpan="6">
              <div className={styles.emptyState}>
                <span className="material-icons">search_off</span>
                <p>No se encontraron pacientes</p>
                <small>Intenta con otro término de búsqueda</small>
              </div>
            </td>
          </tr>
        ) : (
          currentRows.map((p) => (
            <tr key={p.id} className={styles.tableRow}>
              <td className={styles.patientCell}>
                <div className={styles.patientInfo}>
                  <span className={`material-icons ${styles.patientIcon}`}>person</span>
                  <div className={styles.patientDetails}>
                    <div className={styles.patientName}>
                      {p.nombre} {p.apellidoPaterno} {p.apellidoMaterno}
                    </div>
                    <small className={styles.patientSubtext}>
                      {[p.apellidoPaterno, p.apellidoMaterno].filter(Boolean).join(' ')}
                    </small>
                  </div>
                </div>
              </td>
              <td>
                <div className={styles.edadBadge}>
                 
                  {calcularEdad(p.fechaNacimiento)}
                </div>
              </td>
              <td>
                <div className={styles.curpCell}>
                  {p.curp ? (
                    <code className={styles.curpCode}>{p.curp}</code>
                  ) : (
                    <span className={styles.noData}>No asignada</span>
                  )}
                </div>
              </td>
              <td>
                {p.email ? (
                  <div className={styles.emailCell}>
                   
                    {p.email}
                  </div>
                ) : (
                  <span className={styles.noData}>No especificado</span>
                )}
              </td>
              <td>
                {p.telefono ? (
                  <div className={styles.phoneCell}>
                 
                    {p.telefono}
                  </div>
                ) : (
                  <span className={styles.noData}>No especificado</span>
                )}
              </td>
              <td>
                <div className={styles.generoCell}>
             
                  {formatearGenero(p.genero)}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

/* ================================================================
   PAGINACIÓN
================================================================ */
function Paginacion({
  filteredData,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  if (filteredData.length === 0) return null;

  return (
    <div className={styles.paginationTable}>
      <div className={styles.rowsSelectorTable}>
        <label>Filas por página:</label>
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
          <span className="material-icons">chevron_left</span>
        </button>

        <span className={styles.pageInfoTable}>
          Página {currentPage} de {totalPages}
        </span>

        <button
          className={styles.paginationBtn}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
    </div>
  );
}