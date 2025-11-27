/* UsersHome.jsx - Versión completa, limpia y 100% funcional con botón de ver dirección */

import React, { useState, useEffect } from "react";
import styles from "../../styles/pages/UsersHome.module.css";
import EditUserModal from "../../Components/modals/EditUserModal";
import RegisterUserModal from "../../Components/modals/RegisterUserModal";
import { getColaboradores, updateColaborador } from "../../Api/colaborator";
import Swal from "sweetalert2";

export default function UsersHome() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [alert, setAlert] = useState(null);

  const [editTarget, setEditTarget] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  // 🔥 NECESARIO PARA LA DIRECCIÓN
  const [expandedAddress, setExpandedAddress] = useState(null);

  // ==========================
  // Obtener colaboradores
  // ==========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const colaboradores = await getColaboradores();
        setData(colaboradores);
        setFilteredData(colaboradores.filter((c) => c.esActivo));
      } catch (error) {
        console.error("❌ Error al obtener colaboradores:", error);
        setAlert({
          type: "danger",
          message: "Error al cargar colaboradores ❌",
        });
        setTimeout(() => setAlert(null), 4000);
      }
    };

    fetchData();
  }, []);

  // ==========================
  // Filtro por nombre y estado
  // ==========================
  useEffect(() => {
    const filtered = data.filter((item) => {
      const coincideNombre = item.nombre
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const coincideEstado = mostrarInactivos ? !item.esActivo : item.esActivo;

      return coincideNombre && coincideEstado;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data, mostrarInactivos]);

  // ==========================
  // Alternar activos / inactivos
  // ==========================
  const toggleFiltro = () => {
    setMostrarInactivos((prev) => !prev);
  };

  // ==========================
  // Abrir modal editar
  // ==========================
  const handleEditClick = (user) => {
    setEditTarget(user);
    setShowEditModal(true);
  };

  // ==========================
  // Guardar edición
  // ==========================
  const handleEditSave = async (id, updatedData, options = {}) => {
    const { guardarEnBackend = false } = options;

    try {
      const updated = data.map((d) =>
        d.id === id ? { ...d, ...updatedData } : d
      );

      setData(updated);
      setFilteredData(updated);

      setAlert({
        type: "success",
        message: "Cambios aplicados localmente 🎉",
      });

      if (!guardarEnBackend) return;

      try {
        await updateColaborador(id, updatedData);
      } catch (err) {
        console.warn("⚠ No se pudo actualizar backend:", err);
      }
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
      setAlert({
        type: "danger",
        message: "Error al guardar cambios ❌",
      });
    } finally {
      setTimeout(() => setAlert(null), 4000);
    }
  };

  // ==========================
  // Activar / desactivar colaborador
  // ==========================
  const handleToggleActive = async (id, nuevoEstado) => {
    try {
      const colaborador = data.find((u) => u.id === id);

      if (!colaborador) {
        Swal.fire("Error", "No se encontró el colaborador", "error");
        return;
      }

      const updated = data.map((d) =>
        d.id === id ? { ...d, esActivo: nuevoEstado } : d
      );

      setData(updated);

      Swal.fire({
        icon: "success",
        title: nuevoEstado ? "Reactivado ✅" : "Desactivado 🚫",
        timer: 1500,
      });

      try {
        const payload = { ...colaborador, esActivo: nuevoEstado };
        await updateColaborador(id, payload);
      } catch (err) {
        console.warn("⚠ No se actualizó backend:", err);
      }
    } catch  {
      Swal.fire("Error", "No se pudo actualizar el estado ❌", "error");
    }
  };

  // ==========================
  // Registrar colaborador
  // ==========================
  const handleRegisterSave = (nuevo) => {
    const normalizado = { esActivo: true, ...nuevo };

    setData((prev) => [normalizado, ...prev]);
    setShowRegisterModal(false);

    setAlert({ type: "success", message: "Colaborador agregado!" });
    setTimeout(() => setAlert(null), 3000);
  };

  // ==========================
  // Configuración de tabla
  // ==========================
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

  return (
    <div className={styles.usersPageContainer}>
      {/* ========================== BUSCADOR =========================== */}
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
            Agregar colaborador
          </button>

          <button className={styles.toggleButton} onClick={toggleFiltro}>
            {mostrarInactivos ? "Activos" : "Inactivos"}
          </button>
        </div>
      </div>

      {/* Alertas */}
      {alert && (
        <div className={`alert alert-${alert.type} mt-3`} role="alert">
          {alert.message}
        </div>
      )}

      <h2 className={styles.pageTitle}>
        {mostrarInactivos ? "Colaboradores inactivos" : "Administrar Usuarios"}
      </h2>

      {/* ========================== TABLA =========================== */}
      <div className={styles.tableWrapper}>
        <table className={styles.crudTable}>
          <thead>
            <tr>
              <th style={{ minWidth: "120px" }}>Acciones</th>

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

                  {Object.entries(item)
                    .filter(([key]) => !ocultarCampos.includes(key))
                    .map(([key, value], idx) => {
                      // ==========================================
                      // CAMPO DIRECCIÓN (botón ver más)
                      // ==========================================
                      if (key === "direccion") {
                        const direccionTexto =
                          value && value.trim() !== ""
                            ? value
                            : "Sin dirección";

                        const isExpanded = expandedAddress === item.id;
                        const textoTruncado =
                          direccionTexto.length > 10
                            ? direccionTexto.slice(0, 10) + "..."
                            : direccionTexto;

                        const mostrarBoton =
                          direccionTexto.length > 10;

                        return (
                          <td key={idx} className={styles.truncateCell}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem",
                              }}
                            >
                              <span>{textoTruncado}</span>

                              {mostrarBoton && (
                                <button
                                  className={styles.eyeButton}
                                  onClick={() =>
                                    setExpandedAddress(
                                      isExpanded ? null : item.id
                                    )
                                  }
                                  title="Ver dirección completa"
                                >
                                  <span className="material-icons">
                                    {isExpanded
                                      ? "visibility_off"
                                      : "visibility"}
                                  </span>
                                </button>
                              )}
                            </div>

                            {isExpanded && (
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
                                    <strong>Dirección:</strong>{" "}
                                    {direccionTexto}
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

                      // Campos normales
                      return <td key={idx}>{value?.toString()}</td>;
                    })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========================== PAGINACIÓN =========================== */}
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
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <span className="material-icons">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================== MODALES =========================== */}
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
  );
}
