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

  // === Campos ocultos ===
  const ocultarCampos = ["id", "fechaCreacion", "esActivo", "fechaNacimiento"];

  const humanizarCampo = (campo) =>
    campo.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

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

      <div className={styles.usersPageContainer}>
        
        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}
        <header className={styles.header}>
          <img src={logo} alt="Logo" className={styles.logo} />

          <div className={styles.userBox}>
            <span className="material-icons">account_circle</span>
            {usuario?.nombreUsuario || "Usuario"}
          </div>
        </header>

        <hr className={styles.divider} />

        {/* ===================================================== */}
        {/* BARRA BUSQUEDA + BOTON REGISTRAR */}
        {/* ===================================================== */}
        <div className={styles.usersNav}>
          <div className={styles.searchBox}>
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Buscar paciente..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className={styles.toggleButton}
            onClick={() => setShowRegisterModal(true)}
          >
            <span className="material-icons">person_add</span>
            Registrar Paciente
          </button>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type} mt-3`}>{alert.message}</div>
        )}

        <h2 className={styles.pageTitle}>Administrar Pacientes</h2>

        {/* ===================================================== */}
        {/* TABLA */}
        {/* ===================================================== */}
        <TablaPacientes
          filteredData={filteredData}
          currentRows={currentRows}
          ocultarCampos={ocultarCampos}
          humanizarCampo={humanizarCampo}
        />

        {/* ===================================================== */}
        {/* PAGINACIÓN */}
        {/* ===================================================== */}
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
  );
}

/* ================================================================
   TABLA PACIENTES
================================================================ */
function TablaPacientes({ filteredData, currentRows, ocultarCampos, humanizarCampo }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.crudTable}>
        <thead>
          <tr>
            {filteredData.length > 0 &&
              Object.keys(filteredData[0])
                .filter((key) => !ocultarCampos.includes(key))
                .map((key) => <th key={key}>{humanizarCampo(key)}</th>)}
          </tr>
        </thead>

        <tbody>
          {currentRows.length === 0 ? (
            <tr>
              <td colSpan="100%" style={{ textAlign: "center", padding: "1rem" }}>
                No se encontraron registros
              </td>
            </tr>
          ) : (
            currentRows.map((paciente) => (
              <tr key={paciente.id}>
                {Object.entries(paciente)
                  .filter(([key]) => !ocultarCampos.includes(key))
                  .map(([key, value]) => (
                    <td key={key}>{String(value ?? "")}</td>
                  ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
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
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.pageControls}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              <span className="material-icons">chevron_left</span>
            </button>

            <span>
              Página {currentPage} de {totalPages || 1}
            </span>

            <button
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
//.