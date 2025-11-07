/*UsersHome.jsx*/
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
  const [expandedAddress, setExpandedAddress] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  // === Obtener colaboradores ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const colaboradores = await getColaboradores();
        setData(colaboradores);
        setFilteredData(colaboradores.filter((c) => c.esActivo));
      } catch (error) {
        console.error("❌ Error al obtener colaboradores:", error);
        setAlert({ type: "danger", message: "Error al cargar colaboradores ❌" });
        setTimeout(() => setAlert(null), 4000);
      }
    };
    fetchData();
  }, []);

  // === Filtro por nombre + estado ===
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

  // === Alternar filtro activos/inactivos ===
  const toggleFiltro = () => setMostrarInactivos((prev) => !prev);

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
      setAlert({ type: "success", message: "Colaborador actualizado ✅" });
    } catch (error) {
      console.error("❌ Error al actualizar colaborador:", error);
      setAlert({ type: "danger", message: "Error al actualizar colaborador ❌" });
    } finally {
      setTimeout(() => setAlert(null), 4000);
    }
  };

  // === Activar / Desactivar colaborador ===
const handleToggleActive = async (id, nuevoEstado) => {
  try {
    const colaborador = data.find((u) => u.id === id);
    if (!colaborador) {
      Swal.fire("Error", "No se encontró el colaborador", "error");
      return;
    }

    // ✅ Payload EXACTO compatible con CrearUsuarioDto
    const payload = {
      nombreUsuario: colaborador.nombreUsuario || "usuario_temp",
      contrasenia: colaborador.contrasenia || "123456",
      nombre: colaborador.nombre || "Desconocido",
      apellidoPaterno: colaborador.apellidoPaterno || "SinPaterno",
      apellidoMaterno: colaborador.apellidoMaterno || "SinMaterno",
      curp: colaborador.curp || "XXXX000000XXXXXX00",
      email: colaborador.email || "sinemail@demo.com",
      edad: Number(colaborador.edad) || 0,
      fechaNacimiento: new Date(
        colaborador.fechaNacimiento || new Date()
      ).toISOString(),
      direccion: colaborador.direccion || "Sin dirección",
      telefono: colaborador.telefono || "0000000000",
      fechaContrato: new Date(
        colaborador.fechaContrato || new Date()
      ).toISOString(),
      matriculaProfesional: colaborador.matriculaProfesional || "00000000",
      licencia: colaborador.licencia || "00000000",
      genero: colaborador.genero || "No especificado",
      esActivo: nuevoEstado,
      iD_Cede: Number(colaborador.iD_Cede) || 1,
      iD_TipoColaborador: Number(colaborador.iD_TipoColaborador) || 1,
      iD_Modulo: Number(colaborador.iD_Modulo) || 1,
      iD_Especialidad: Number(colaborador.iD_Especialidad) || 1,
    };

    console.log("📤 Enviando payload válido al backend:", payload);

    await updateColaborador(id, payload);

    Swal.fire({
      icon: "success",
      title: nuevoEstado ? "Reactivado ✅" : "Desactivado 🚫",
      text: `El colaborador fue ${
        nuevoEstado ? "activado" : "desactivado"
      } correctamente`,
      confirmButtonColor: "#1e5e5c",
      timer: 1500,
    });

    // 🔹 Actualizar estado local sin recargar
    const updated = data.map((d) =>
      d.id === id ? { ...d, esActivo: nuevoEstado } : d
    );
    setData(updated);
  } catch (error) {
    console.error("❌ Error al cambiar estado:", error);
    Swal.fire(
      "Error",
      "No se pudo actualizar el estado del colaborador ❌",
      "error"
    );
  }
};



  // === Alta de colaborador ===
  const handleRegisterSave = (nuevo) => {
    const normalizado = { esActivo: true, ...nuevo };
    setData((prev) => [normalizado, ...prev]);
    setShowRegisterModal(false);
    setAlert({ type: "success", message: "Colaborador agregado ✅" });
    setTimeout(() => setAlert(null), 3000);
  };

  // === Helpers de tabla ===
  const ocultarCampos = [
    "id",
    "iD_Cede",
    "esActivo",
    "fechaCreacion",
    "fechaActualizacion",
    "fechaContrato",
  ];

  const formatearFecha = (fecha) => {
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
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
      {/* === Buscador + Botones === */}
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
            title="Agregar colaborador"
          >
            <span className="material-icons">person_add</span>
            Agregar colaborador
          </button>

          <button className={styles.toggleButton} onClick={toggleFiltro}>
            {mostrarInactivos ? "Activos" : "Inactivos"}
          </button>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} mt-3`} role="alert">
          {alert.message}
        </div>
      )}

      <h2 className={styles.pageTitle}>
        {mostrarInactivos ? "Colaboradores inactivos" : "Administrar Usuarios"}
      </h2>

      {/* === Tabla === */}
      <div className={styles.tableWrapper}>
        <table className={styles.crudTable}>
          <thead>
            <tr>
              <th style={{ minWidth: "120px" }}>Acciones</th>
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
                  {mostrarInactivos
                    ? "No hay colaboradores inactivos"
                    : "No se encontraron registros"}
                </td>
              </tr>
            ) : (
              currentRows.map((item) => (
                <tr key={item.id}>
                  {/* === Acciones === */}
                  <td className={styles.actionCell}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditClick(item)}
                      title="Editar"
                    >
                      <span className="material-icons">edit</span>
                    </button>

                    <label
                      className={styles.switch}
                      title={item.esActivo ? "Activo" : "Inactivo"}
                    >
                      <input
                        type="checkbox"
                        checked={!!item.esActivo}
                        onChange={() => handleToggleActive(item.id, !item.esActivo)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </td>

                  {/* === Campos dinámicos === */}
                  {Object.entries(item)
                    .filter(([key]) => !ocultarCampos.includes(key))
                    .map(([key, value], idx) => {
                      if (key === "fechaNacimiento") {
                        return <td key={idx}>{formatearFecha(value)}</td>;
                      }

                      if (key === "direccion") {
  const direccionTexto =
    value && value.trim() !== "" ? value : "Sin dirección";
  const isExpanded = expandedAddress === item.id;

  // 🔸 Si es muy larga, se trunca
  const textoTruncado =
    direccionTexto.length > 10
      ? direccionTexto.slice(0, 10) + "..."
      : direccionTexto;

  // 🔸 Mostrar el botón solo si la dirección tiene más de 15 caracteres
  const mostrarBoton = direccionTexto.length > 10;

  return (
    <td key={idx} className={styles.truncateCell}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <span>{textoTruncado}</span>

        {mostrarBoton && (
          <button
            className={styles.eyeButton}
            onClick={() => setExpandedAddress(isExpanded ? null : item.id)}
            title="Ver dirección completa"
          >
            <span className="material-icons">
              {isExpanded ? "visibility_off" : "visibility"}
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
            <h3>📍 Dirección completa del colaborador</h3>
            <p>
              <strong>Nombre:</strong>{" "}
              {item.nombre} {item.apellidoPaterno} {item.apellidoMaterno}
            </p>
            <p>
              <strong>Dirección:</strong> {direccionTexto}
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
              ))
            )}
          </tbody>
        </table>
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

      {/* === Modales === */}
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
