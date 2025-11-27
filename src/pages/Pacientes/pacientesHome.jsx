// PacientesHome.jsx
import React, { useState, useEffect } from "react";
import styles from "../../styles/pages/UsersHome.module.css";
import Swal from "sweetalert2";
import SidebarMenu from "../../Components/SidebarMenu";
import RegisterPacienteModal from "../../Components/modals/RegisterPacienteModal";
import { getPacientes } from "../../Api/paciente";

// 🔹 Sidebars
import { SidebarAdmin, SidebarNurse, SidebarDoctor } from "../../Config/sidebars";

// 🔹 Logo
import logo from "../../assets/logoLargo.png";

export default function PacientesHome() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [, setSeccion] = useState("Pacientes");
  const [usuario, setUsuario] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // === Actualizar hora en tiempo real ===
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // === Cargar usuario ===
  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      const parsed = JSON.parse(userData);
      parsed.tipoColaborador = parsed.tipoColaborador?.toString().trim().toLowerCase();
      setUsuario(parsed);
    }
  }, []);

  // === Sidebar según rol ===
  const getOpcionesSidebar = () => {
    if (!usuario) return [];

    const tipo = usuario.tipoColaborador;

    if (tipo.includes("admin") || tipo.includes("administrador") || tipo === "3")
      return SidebarAdmin;

    if (tipo.includes("enfermera") || tipo === "2")
      return SidebarNurse;

    if (tipo.includes("medico") || tipo.includes("médico") || tipo === "1")
      return SidebarDoctor;

    return SidebarDoctor;
  };

  const opcionesSidebar = getOpcionesSidebar();

  // === Cargar pacientes ===
  const fetchPacientes = async () => {
    try {
      const lista = await getPacientes();
      const activos = (Array.isArray(lista) ? lista : []).filter((p) => p.esActivo);
      setData(activos);
      setFilteredData(activos);
    } catch (error) {
      console.error("❌ Error al obtener pacientes:", error);
      setAlert({ type: "danger", message: "Error al cargar pacientes ❌" });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  // === Filtro ===
  useEffect(() => {
    const filtered = data.filter((p) => {
      const nombre = [p.nombre, p.apellidoPaterno, p.apellidoMaterno]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return nombre.includes(searchTerm.toLowerCase());
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  // === Formatear fecha y hora ===
  const formatTime = (date) => {
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // === Paginación ===
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className={styles.mainLayout}>

      {/* ❗ Sidebar solo si NO es Admin */}
      {usuario &&
        !(usuario.tipoColaborador.includes("admin") ||
          usuario.tipoColaborador.includes("administrador") ||
          usuario.tipoColaborador === "3") && (
          <SidebarMenu
            setSeccion={setSeccion}
            seccionActiva="Pacientes"
            opcionesCustom={opcionesSidebar}
            passObject={true}
          />
      )}

      <div className={styles.contentArea}>
        <div className={styles.container}>
          
          {/* ===== HEADER COMPACTO ===== */}
          <header className={styles.header}>
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

          {/* ===== BARRA DE BÚSQUEDA ===== */}
          <section className={styles.searchSection}>
            <div className={styles.searchBarWrapper}>
              <span className={`material-icons ${styles.searchIcon}`}>search</span>
              <input
                type="text"
                placeholder="Buscar paciente por nombre..."
                className={styles.searchBar}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </section>

          {/* ===== ENCABEZADO DE SECCIÓN ===== */}
          <section className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <span className="material-icons">people</span>
              Administrar Pacientes
            </div>
            
            <div className={styles.appointmentCount}>
              <span className="material-icons">person</span>
              {filteredData.length} Pacientes
            </div>

            
          </section>

          {/* ===== ALERTAS ===== */}
          {alert && (
            <div className={`alert alert-${alert.type}`}>{alert.message}</div>
          )}

          {/* ===== CONTENEDOR DE SCROLL CON TABLA ===== */}
          <div className={styles.scrollContainer}>
            <div className={styles.tableWrapper}>
              <TablaPacientes
                currentRows={currentRows}
                filteredData={filteredData}
              />
            </div>
          </div>

          {/* ===== PAGINACIÓN ===== */}
          <Paginacion
            filteredData={filteredData}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />

          {showRegisterModal && (
            <RegisterPacienteModal
              onClose={() => setShowRegisterModal(false)}
              onSave={fetchPacientes}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   TABLA PACIENTES - SOLO CAMPOS SOLICITADOS
================================================================ */
function TablaPacientes({ currentRows}) {
  // Función para calcular edad desde fecha de nacimiento
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/A';
    try {
      const nacimiento = new Date(fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      return `${edad} años`;
    } catch{
      return 'N/A';
    }
  };

  // Función para formatear género
  const formatearGenero = (genero) => {
    if (!genero) return 'No especificado';
    const gen = genero.toString().toLowerCase();
    if (gen === 'm' || gen === 'masculino') return 'Masculino';
    if (gen === 'f' || gen === 'femenino') return 'Femenino';
    return genero;
  };

  return (
    <div className={styles.tableContainer}>
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
              <td colSpan="7">
                <div className={styles.emptyState}>
                  <span className={`material-icons ${styles.emptyIcon}`}>search_off</span>
                  <p>No se encontraron pacientes</p>
                  <small>Intenta con otros términos de búsqueda</small>
                </div>
              </td>
            </tr>
          ) : (
            currentRows.map((paciente) => (
              <tr key={paciente.id} className={styles.tableRow}>
                {/* Nombre Completo */}
                <td className={styles.patientCell}>
                  <div className={styles.patientInfo}>
                    <span className={`material-icons ${styles.patientIcon}`}>person</span>
                    <div className={styles.patientDetails}>
                      <div className={styles.patientName}>
                        {paciente.nombre || 'N/A'} {paciente.apellidoPaterno || ''} {paciente.apellidoMaterno || ''}
                      </div>
                      <small className={styles.patientSubtext}>
                        {[paciente.apellidoPaterno, paciente.apellidoMaterno].filter(Boolean).join(' ')}
                      </small>
                    </div>
                  </div>
                </td>

                {/* Edad */}
                <td>
                  <div className={styles.edadBadge}>
                    
                    {calcularEdad(paciente.fechaNacimiento)}
                  </div>
                </td>

                {/* CURP */}
                <td>
                  <div className={styles.curpCell}>
                    {paciente.curp ? (
                      <code className={styles.curpCode}>{paciente.curp}</code>
                    ) : (
                      <span className={styles.noData}>No asignada</span>
                    )}
                  </div>
                </td>

                {/* Email */}
                <td>
                  {paciente.email ? (
                    <div className={styles.emailCell}>
                      
                      {paciente.email}
                    </div>
                  ) : (
                    <span className={styles.noData}>No especificado</span>
                  )}
                </td>

                {/* Teléfono */}
                <td>
                  {paciente.telefono ? (
                    <div className={styles.phoneCell}>
                      
                      {paciente.telefono}
                    </div>
                  ) : (
                    <span className={styles.noData}>No especificado</span>
                  )}
                </td>

                {/* Género */}
                <td>
                  <div className={styles.generoCell}>
                    
                    {formatearGenero(paciente.genero)}
                  </div>
                </td>

                
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ================================================================
   PAGINACIÓN - ESTILO MEITECH
================================================================ */
function Paginacion({
  filteredData,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  return (
    <>
      {filteredData.length > 0 && (
        <div className={styles.paginationContainer}>
          <div className={styles.rowsSelector}>
            <label>Filas por página:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={styles.paginationSelect}
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.pageControls}>
            <button 
              className={styles.paginationBtn}
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <span className="material-icons">chevron_left</span>
            </button>

            <span className={styles.pageInfo}>
              Página {currentPage} de {totalPages || 1}
            </span>

            <button
              className={styles.paginationBtn}
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <span className="material-icons">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}