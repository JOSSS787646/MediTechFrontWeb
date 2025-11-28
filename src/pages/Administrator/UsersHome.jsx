/* UsersHome.jsx - Versión completa con Header + Sidebar + Layout unificado */

import React, { useState, useEffect } from "react";
import styles from "../../styles/pages/UsersHome.module.css";

import EditUserModal from "../../Components/modals/EditUserModal";
import RegisterUserModal from "../../Components/modals/RegisterUserModal";

import SidebarMenu from "../../Components/SidebarMenu";
import {
  SidebarAdmin,
  SidebarNurse,
  SidebarDoctor,
} from "../../Config/sidebars";

import { getColaboradores, updateColaborador } from "../../Api/colaborator";
import Swal from "sweetalert2";
import logo from "../../assets/logoLargo.png";

export default function UsersHome() {
  /* ========================================================================
     ESTADOS ORIGINALES (NO SE TOCAN)
  ======================================================================== */
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [alert, setAlert] = useState(null);

  const [editTarget, setEditTarget] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [expandedAddress, setExpandedAddress] = useState(null);

  /* ========================================================================
     ⏱ HORA Y FECHA
  ======================================================================== */
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date) =>
    date.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  /* ========================================================================
     👤 USUARIO + SIDEBAR
  ======================================================================== */
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("usuario");
    if (data) {
      const parsed = JSON.parse(data);
      parsed.tipoColaborador = String(parsed.tipoColaborador).toLowerCase();
      setUsuario(parsed);
    }
  }, []);

  const getSidebar = () => {
    if (!usuario) return [];

    const tipo = usuario.tipoColaborador;

    if (["admin", "administrador", "3"].includes(tipo)) return SidebarAdmin;
    if (["enfermera", "2"].includes(tipo)) return SidebarNurse;
    return SidebarDoctor;
  };

  const opcionesSidebar = getSidebar();

  /* ========================================================================
     🔥 CARGAR COLABORADORES
  ======================================================================== */
  useEffect(() => {
    const cargar = async () => {
      try {
        const lista = await getColaboradores();
        setData(lista);
        setFilteredData(lista.filter((c) => c.esActivo));
      } catch (error) {
        console.error("❌ Error al cargar colaboradores:", error);
        setAlert({
          type: "danger",
          message: "No se pudieron obtener los colaboradores ❌",
        });
        setTimeout(() => setAlert(null), 3500);
      }
    };

    cargar();
  }, []);

  /* ========================================================================
     FILTRO (nombre + activos/inactivos)
  ======================================================================== */
  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchName = item.nombre
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchState = mostrarInactivos ? !item.esActivo : item.esActivo;

      return matchName && matchState;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, mostrarInactivos, data]);

  const toggleFiltro = () => setMostrarInactivos((p) => !p);

  /* ========================================================================
     EDITAR / TOGGLE ACTIVAR
  ======================================================================== */
  const handleEditClick = (user) => {
    setEditTarget(user);
    setShowEditModal(true);
  };

  const handleEditSave = async (id, updatedData, options = {}) => {
    const { guardarEnBackend = false } = options;

    try {
      const updated = data.map((d) =>
        d.id === id ? { ...d, ...updatedData } : d
      );

      setData(updated);
      setFilteredData(updated);

      setAlert({ type: "success", message: "Cambios aplicados 🎉" });

      if (guardarEnBackend) {
        try {
          await updateColaborador(id, updatedData);
        } catch {
          console.warn("⚠ Error actualizando backend");
        }
      }
    } catch {
      setAlert({ type: "danger", message: "Error al actualizar ❌" });
    } finally {
      setTimeout(() => setAlert(null), 3500);
    }
  };

  const handleToggleActive = async (id, nuevoEstado) => {
    const colaborador = data.find((c) => c.id === id);

    if (!colaborador) {
      Swal.fire("Error", "Colaborador no encontrado", "error");
      return;
    }

    const updated = data.map((c) =>
      c.id === id ? { ...c, esActivo: nuevoEstado } : c
    );

    setData(updated);

    Swal.fire({
      icon: "success",
      title: nuevoEstado ? "Activado" : "Desactivado",
      timer: 1500,
    });

    try {
      await updateColaborador(id, { ...colaborador, esActivo: nuevoEstado });
    } catch {
      console.warn("⚠ No se pudo actualizar backend");
    }
  };

  /* ========================================================================
     REGISTRAR
  ======================================================================== */
  const handleRegisterSave = (nuevo) => {
    const nuevoFormato = { esActivo: true, ...nuevo };
    setData((prev) => [nuevoFormato, ...prev]);

    setAlert({ type: "success", message: "Colaborador registrado!" });
    setTimeout(() => setAlert(null), 3000);

    setShowRegisterModal(false);
  };

  /* ========================================================================
     PAGINACIÓN
  ======================================================================== */
  const ocultarCampos = [
    "id",
    "iD_Cede",
    "esActivo",
    "fechaCreacion",
    "fechaActualizacion",
    "fechaContrato",
    "usuarioNombre",
    "usuarioContrasenia",
    "fechaNacimiento",
    "estado",
    "genero",
    "licencia",
    "matriculaProfesional",
    "iD_TipoColaborador",
    "iD_Especialidad",
  ];

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  /* ========================================================================
     RENDER FINAL
  ======================================================================== */
  return (
    <div className={styles.mainLayout}>

      {/** SIDEBAR (Admin no lo usa porque su layout ya lo incluye) */}
      {usuario &&
        !["admin", "administrador", "3"].includes(usuario?.tipoColaborador) && (
          <SidebarMenu
            opcionesCustom={opcionesSidebar}
            passObject={true}
            seccionActiva="Usuarios"
          />
        )}

      <div className={styles.contentArea}>
        {/* ======================= HEADER ======================= */}
        <header className={styles.headerSticky}>
          <div className={styles.logoBox}>
            <img src={logo} alt="Logo" className={styles.logo} />
          </div>

          <div className={styles.userInfo}>
            <div className={styles.userName}>
              <span className="material-icons">account_circle</span>
              {usuario?.nombreUsuario ?? "Usuario"}
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

        {/* ======================= CONTENIDO ======================= */}
        <div className={styles.usersPageContainer}>
          {/* NAV */}
          <div className={styles.usersNav}>
            <div className={styles.searchBox}>
              <span className="material-icons">search</span>

              <input
                type="text"
                placeholder="Buscar por nombre..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className={styles.addUserButton}
                onClick={() => setShowRegisterModal(true)}
              >
                <span className="material-icons">person_add</span>
                Agregar
              </button>

              <button className={styles.toggleButton} onClick={toggleFiltro}>
                {mostrarInactivos ? "Activos" : "Inactivos"}
              </button>
            </div>
          </div>

          {alert && (
            <div className={`alert alert-${alert.type}`}>{alert.message}</div>
          )}

          <h2 className={styles.pageTitle}>
            {mostrarInactivos ? "Colaboradores inactivos" : "Administrar Usuarios"}
          </h2>

          {/* TABLA */}
          <div className={styles.tableWrapper}>
            <table className={styles.crudTable}>
              <thead>
                <tr>
                  <th>Acciones</th>

                  {filteredData.length > 0 &&
                    Object.keys(filteredData[0])
                      .filter((key) => !ocultarCampos.includes(key))
                      .map((key) => (
                        <th key={key}>
                          {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                        </th>
                      ))}
                </tr>
              </thead>

              <tbody>
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan="100%" style={{ textAlign: "center" }}>
                      {mostrarInactivos
                        ? "No hay colaboradores inactivos"
                        : "No se encontraron registros"}
                    </td>
                  </tr>
                ) : (
                  currentRows.map((item) => (
                    <tr key={item.id}>
                      {/* ACCIONES */}
                      <td className={styles.actionCell}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditClick(item)}
                        >
                          <span className="material-icons">edit</span>
                        </button>

                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            checked={!!item.esActivo}
                            onChange={() =>
                              handleToggleActive(item.id, !item.esActivo)
                            }
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </td>

                      {/* CAMPOS */}
                      {Object.entries(item)
                        .filter(([k]) => !ocultarCampos.includes(k))
                        .map(([key, value], idx) => {
                          if (key === "direccion") {
                            const dir = value || "Sin dirección";
                            const expandido = expandedAddress === item.id;

                            return (
                              <td key={idx} className={styles.truncateCell}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: ".4rem",
                                  }}
                                >
                                  <span>
                                    {dir.length > 10
                                      ? dir.slice(0, 10) + "..."
                                      : dir}
                                  </span>

                                  {dir.length > 10 && (
                                    <button
                                      className={styles.eyeButton}
                                      onClick={() =>
                                        setExpandedAddress(
                                          expandido ? null : item.id
                                        )
                                      }
                                    >
                                      <span className="material-icons">
                                        {expandido
                                          ? "visibility_off"
                                          : "visibility"}
                                      </span>
                                    </button>
                                  )}
                                </div>

                                {expandido && (
                                  <div
                                    className={styles.cardOverlay}
                                    onClick={() => setExpandedAddress(null)}
                                  >
                                    <div
                                      className={styles.infoCard}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <h3>📍 Dirección completa</h3>

                                      <p>
                                        <strong>Colaborador:</strong>{" "}
                                        {item.nombre} {item.apellidoPaterno}{" "}
                                        {item.apellidoMaterno}
                                      </p>

                                      <p>
                                        <strong>Dirección:</strong> {dir}
                                      </p>

                                      <button
                                        className={styles.closeCardButton}
                                        onClick={() =>
                                          setExpandedAddress(null)
                                        }
                                      >
                                        Cerrar
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </td>
                            );
                          }

                          return <td key={idx}>{value?.toString()}</td>;
                        })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
          {filteredData.length > 0 && (
            <div className={styles.paginationContainer}>
              <div className={styles.rowsSelector}>
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

              <div className={styles.pageControls}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <span className="material-icons">chevron_left</span>
                </button>

                <span>
                  Página {currentPage} de {totalPages || 1}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <span className="material-icons">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {/* MODALES */}
          {showEditModal && editTarget && (
            <EditUserModal
              user={editTarget}
              onClose={() => setShowEditModal(false)}
              onSave={handleEditSave}
            />
          )}

          {showRegisterModal && (
            <RegisterUserModal
              onClose={() => setShowRegisterModal(false)}
              onSave={handleRegisterSave}
            />
          )}
        </div>
      </div>
    </div>
  );
}
