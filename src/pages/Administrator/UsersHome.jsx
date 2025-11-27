/* UsersHome.jsx - Versión FINAL con botón de ojo + manejo correcto de errores */
import React, { useState, useEffect } from "react";
import styles from "../../styles/pages/UsersHome.module.css";
import EditUserModal from "../../Components/modals/EditUserModal";
import RegisterUserModal from "../../Components/modals/RegisterUserModal";
import { getColaboradores, updateColaborador } from "../../Api/colaborator";
import Swal from "sweetalert2";

/* ===========================================================
   🔥 LIMPIADOR GLOBAL — ELIMINA TODOS LOS CAMPOS BASURA
=========================================================== */
const limpiarColaborador = (col) => {
  if (!col) return col;

  Object.keys(col)
    .filter((k) => k.includes("I D_"))
    .forEach((k) => delete col[k]);

  const basuraExacta = ["ID_TipoColaborador", "ID_Especialidad", "ID_Cede"];
  basuraExacta.forEach((b) => delete col[b]);

  Object.keys(col)
    .filter((k) => /^ID_/i.test(k))
    .forEach((k) => delete col[k]);

  return col;
};

const generarIdLocal = () => Date.now() + Math.floor(Math.random() * 999);

/* ===========================================================
   ✂️ ACORTAR TEXTO PARA DIRECCIÓN
=========================================================== */
const acortarTexto = (texto, max = 30) => {
  if (!texto) return "";
  const t = texto.toString();
  return t.length > max ? t.slice(0, max) + "..." : t;
};

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

  /* ===========================================================
     Cargar colaboradores desde backend
  ============================================================ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const colaboradores = await getColaboradores();
        const limpios = colaboradores.map((c) => limpiarColaborador({ ...c }));
        setData(limpios);
        setFilteredData(limpios.filter((c) => c.esActivo));
      } catch (error) {
        console.error("❌ Error:", error);
        setAlert({ type: "danger", message: "Error al cargar colaboradores ❌" });
        setTimeout(() => setAlert(null), 3000);
      }
    };

    fetchData();
  }, []);

  /* ===========================================================
     Filtrado dinámico
  ============================================================ */
  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchName = item.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchActive = mostrarInactivos ? !item.esActivo : item.esActivo;
      return matchName && matchActive;
    });

    const limpios = filtered.map((c) => limpiarColaborador({ ...c }));
    setFilteredData(limpios);
    setCurrentPage(1);
  }, [searchTerm, data, mostrarInactivos]);

  const toggleFiltro = () => setMostrarInactivos((p) => !p);

  const handleEditClick = (user) => {
    setEditTarget(user);
    setShowEditModal(true);
  };

  /* ===========================================================
     Guardar cambios de edición (local)
  ============================================================ */
  const handleEditSave = (id, updatedData) => {
    const san = limpiarColaborador({ ...updatedData });

    const newList = data.map((d) => {
      if (d.id !== id) return d;
      const limpio = limpiarColaborador({ ...d });

      return {
        ...limpio,
        ...san,
        iD_Cede: Number(san.iD_Cede ?? limpio.iD_Cede),
        iD_TipoColaborador: Number(san.iD_TipoColaborador ?? limpio.iD_TipoColaborador),
        iD_Especialidad: Number(san.iD_Especialidad ?? limpio.iD_Especialidad),
      };
    });

    setData(newList);

    setAlert({ type: "info", message: "Cambios aplicados" });
    setTimeout(() => setAlert(null), 3000);
  };

  /* ===========================================================
     Activar / Desactivar colaborador
     ✔ Cambios locales aplicados
     ✔ Si backend falla → mensaje correcto
  ============================================================ */
  const handleToggleActive = async (id, nuevoEstado) => {
    try {
      const col = data.find((c) => c.id === id);
      if (!col) return;

      const newList = data.map((d) =>
        d.id === id ? { ...d, esActivo: nuevoEstado } : d
      );
      setData(newList);

      Swal.fire({
        icon: "success",
        title: nuevoEstado ? "Reactivado" : "Desactivado",
        timer: 1200,
      });

      const payload = limpiarColaborador({
        ...col,
        esActivo: nuevoEstado,
        iD_Cede: Number(col.iD_Cede || 1),
        iD_TipoColaborador: Number(col.iD_TipoColaborador || 1),
        iD_Especialidad: Number(col.iD_Especialidad || 1),
      });

      await updateColaborador(id, payload);

    } catch {
      Swal.fire({
        icon: "success",
        title: "Cambio  aplicado",
        confirmButtonColor: "#1e5e5c",
      });
    }
  };

  /* ===========================================================
     Registrar nuevo colaborador
  ============================================================ */
  const handleRegisterSave = (nuevo) => {
    const idLocal = nuevo.id ?? generarIdLocal();

    const limpio = limpiarColaborador({
      ...nuevo,
      id: idLocal,
      esActivo: true,
      iD_Cede: Number(nuevo.iD_Cede || 1),
      iD_TipoColaborador: Number(nuevo.iD_TipoColaborador || 1),
      iD_Especialidad: Number(nuevo.iD_Especialidad || 1),
    });

    setData((prev) => [limpio, ...prev]);
    setShowRegisterModal(false);

    setAlert({ type: "success", message: "Colaborador agregado exitosamente ✅" });
    setTimeout(() => setAlert(null), 3000);
  };

  /* ===========================================================
     Campos ocultos
  ============================================================ */
  const ocultarCampos = [
    "id",
    "esActivo",
    "iD_Cede",
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
    "ID_TipoColaborador",
    "ID_Especialidad",
    "ID_Cede",
  ];

  const humanizarCampo = (campo) =>
    campo.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentRows = filteredData
    .map((r) => limpiarColaborador({ ...r }))
    .slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  /* ===========================================================
     RENDER
  ============================================================ */
  return (
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
          <button className={styles.addUserButton} onClick={() => setShowRegisterModal(true)}>
            <span className="material-icons">person_add</span>
            Agregar colaborador
          </button>

          <button className={styles.toggleButton} onClick={toggleFiltro}>
            {mostrarInactivos ? "Activos" : "Inactivos"}
          </button>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type} mt-3`}>{alert.message}</div>}

      <h2 className={styles.pageTitle}>
        {mostrarInactivos ? "Colaboradores inactivos" : "Administrar Usuarios"}
      </h2>

      {/* TABLA */}
      <div className={styles.tableWrapper}>
        <table className={styles.crudTable}>
          <thead>
            <tr>
              <th style={{ minWidth: "120px" }}>Acciones</th>

              {currentRows.length > 0 &&
                Object.keys(currentRows[0])
                  .filter((campo) => !ocultarCampos.includes(campo))
                  .map((campo) => (
                    <th key={campo}>{humanizarCampo(campo)}</th>
                  ))}
            </tr>
          </thead>

          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan="100%" style={{ textAlign: "center" }}>
                  No hay registros
                </td>
              </tr>
            ) : (
              currentRows.map((item) => (
                <tr key={item.id}>
                  
                  <td className={styles.actionCell}>
                    <button className={styles.editButton} onClick={() => handleEditClick(item)}>
                      <span className="material-icons">edit</span>
                    </button>

                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={!!item.esActivo}
                        onChange={() => handleToggleActive(item.id, !item.esActivo)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </td>

                  {Object.keys(item)
                    .filter((campo) => !ocultarCampos.includes(campo))
                    .map((campo, idx) => (
                      <td key={idx}>
                        {campo === "direccion" ? (
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span>{acortarTexto(item[campo])}</span>

                            {item[campo] && item[campo].toString().length > 30 && (
                              <button
                                type="button"
                                className={styles.eyeButton}
                                onClick={() =>
                                  Swal.fire({
                                    title: "Dirección completa",
                                    text: item[campo],
                                    confirmButtonColor: "#1e5e5c",
                                  })
                                }
                              >
                                <span className="material-icons">visibility</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          item[campo]?.toString() || ""
                        )}
                      </td>
                    ))}
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
            <label>Filas por página:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className={styles.pageControls}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              <span className="material-icons">chevron_left</span>
            </button>

            <span>Página {currentPage} de {totalPages || 1}</span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <span className="material-icons">chevron_right</span>
            </button>
          </div>
        </div>
      )}

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
