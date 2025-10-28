// src/pages/Administrator/UsersHome.jsx
import React, { useState, useEffect } from "react";
import styles from "../../styles/pages/UsersHome.module.css";
import EditUserModal from "../../Components/modals/EditUserModal";
import { getColaboradores, updateColaborador } from "../../Api/colaborator";
import Swal from "sweetalert2";

export default function UsersHome() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedAddress, setExpandedAddress] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // === Obtener colaboradores ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const colaboradores = await getColaboradores();
        setData(colaboradores);
        setFilteredData(colaboradores);
      } catch (error) {
        console.error("❌ Error al obtener colaboradores:", error);
        setAlert({ type: "danger", message: "Error al cargar colaboradores ❌" });
        setTimeout(() => setAlert(null), 4000);
      }
    };
    fetchData();
  }, []);

  // === Filtro por nombre ===
  useEffect(() => {
    const filtered = data.filter((item) =>
      item.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  // === Editar usuario ===
  const handleEditClick = (user) => {
    setEditTarget(user);
    setShowEditModal(true);
  };

  const handleEditSave = async (id, updatedData) => {
    try {
      await updateColaborador(id, updatedData);
      const updated = data.map((d) => (d.id === id ? { ...d, ...updatedData } : d));
      setData(updated);
      setFilteredData(updated);
      setAlert({ type: "success", message: "Colaborador actualizado ✅" });
    } catch (error) {
      console.error("❌ Error al actualizar colaborador:", error);
      setAlert({ type: "danger", message: "Error al actualizar colaborador ❌" });
    } finally {
      setTimeout(() => setAlert(null), 4000);
    }
  };

  // === Activar / Desactivar con switch (se mantiene en Acciones) ===
  const handleToggleActive = async (id, nuevoEstado) => {
    try {
      const user = data.find((u) => u.id === id);
      if (!user) return;

      await updateColaborador(id, { ...user, esActivo: nuevoEstado });

      const updated = data.map((d) =>
        d.id === id ? { ...d, esActivo: nuevoEstado } : d
      );
      setData(updated);
      setFilteredData(updated);

      Swal.fire(
        nuevoEstado ? "Reactivado ✅" : "Desactivado 🚫",
        `El colaborador fue ${nuevoEstado ? "activado" : "desactivado"} correctamente`,
        "success"
      );
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
      Swal.fire("Error", "No se pudo actualizar el estado del colaborador ❌", "error");
    }
  };

  // === Config tabla y helpers ===
  // Quitamos SOLO la columna 'esActivo' de la tabla
  const ocultarCampos = ["id", "ID_Cede", "esActivo", "fechaCreacion", "fechaActualizacion", "fechaContrato"];

  const formatearFecha = (fecha) => {
    try {
      const date = new Date(fecha);
      const opciones = { day: "numeric", month: "long", year: "numeric" };
      return date.toLocaleDateString("es-ES", opciones);
    } catch {
      return fecha;
    }
  };

  const humanizarCampo = (campo) =>
    campo.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className={styles.usersPageContainer}>
      {/* === Buscador === */}
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
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} mt-3`} role="alert">
          {alert.message}
        </div>
      )}

      <h2 className={styles.pageTitle}>Administrar Usuarios</h2>

      {/* === Tabla === */}
      <div className={styles.tableWrapper}>
        {filteredData.length === 0 ? (
          <p className={styles.noResults}>No se encontraron registros 🔍</p>
        ) : (
          <table className={styles.crudTable}>
            <thead>
              <tr>
                <th style={{ minWidth: "120px" }}>Acciones</th>
                {Object.keys(data[0])
                  .filter((key) => !ocultarCampos.includes(key))
                  .map((key) => (
                    <th key={key}>{humanizarCampo(key)}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((item) => (
                <tr key={item.id}>
                  {/* === Acciones: Editar + Switch activo/inactivo === */}
                  <td className={styles.actionCell}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditClick(item)}
                      title="Editar"
                    >
                      <span className="material-icons">edit</span>
                    </button>

                    <label className={styles.switch} title={item.esActivo ? "Activo" : "Inactivo"}>
                      <input
                        type="checkbox"
                        checked={!!item.esActivo}
                        onChange={() => handleToggleActive(item.id, !item.esActivo)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </td>

                  {/* === Celdas dinámicas (sin 'esActivo') === */}
                  {Object.entries(item)
                    .filter(([key]) => !ocultarCampos.includes(key))
                    .map(([key, value], idx) => {
                      if (key === "fechaNacimiento") {
                        return <td key={idx}>{formatearFecha(value)}</td>;
                      }

                      if (key === "direccion") {
                        const isExpanded = expandedAddress === item.id;
                        const textoTruncado =
                          value && value.length > 10 ? value.slice(0, 10) + "..." : value;

                        return (
                          <td key={idx} className={styles.truncateCell}>
                            {textoTruncado || "Sin dirección"}
                            {value && value.length > 10 && (
                              <button
                                className={styles.eyeButton}
                                onClick={() =>
                                  setExpandedAddress(isExpanded ? null : item.id)
                                }
                                title="Ver dirección completa"
                              >
                                <span className="material-icons">visibility</span>
                              </button>
                            )}

                            {/* Card con dirección completa */}
                            {isExpanded && (
                              <div
                                className={styles.cardOverlay}
                                onClick={() => setExpandedAddress(null)}
                              >
                                <div
                                  className={styles.infoCard}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <h3>📍 Dirección completa del colaborador</h3>
                                  <p>
                                    <strong>Nombre:</strong> {item.nombre}{" "}
                                    {item.apellidoPaterno} {item.apellidoMaterno}
                                  </p>
                                  <p>
                                    <strong>Dirección:</strong> {item.direccion}
                                  </p>
                                  <button
                                    onClick={() => setExpandedAddress(null)}
                                    className={styles.closeCardButton}
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
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* === Paginación === */}
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
              Página {currentPage} de {totalPages}
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

      {/* === Modal Editar === */}
      {showEditModal && editTarget && (
        <EditUserModal
          user={editTarget}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

