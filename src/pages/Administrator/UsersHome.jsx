import React, { useState, useEffect } from "react";
import styles from "../../styles/pages/UsersHome.module.css";
import RegisterUserModal from "../../Components/modals/RegisterUserModal";
import EditUserModal from "../../Components/modals/EditUserModal";
import { getColaboradores, deleteColaborador, updateColaborador } from "../../Api/colaborator";

export default function UsersHome() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editTarget, setEditTarget] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // === Cargar colaboradores ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const colaboradores = await getColaboradores();
        setData(colaboradores);
      } catch (error) {
        console.error("❌ Error al obtener colaboradores:", error);
        setAlert({ type: "danger", message: "Error al cargar colaboradores ❌" });
        setTimeout(() => setAlert(null), 4000);
      }
    };
    fetchData();
  }, []);

  // === Agregar usuario ===
  const handleAdd = (newUser) => {
    setData([...data, newUser]);
    setAlert({ type: "success", message: "Usuario registrado con éxito ✅" });
    setTimeout(() => setAlert(null), 4000);
  };

  // === Confirmar eliminación ===
  const confirmDelete = (id) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  // === Eliminar colaborador ===
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteColaborador(deleteTarget);
      setData(data.filter((d) => d.id !== deleteTarget));
      setAlert({ type: "success", message: "Colaborador eliminado correctamente ✅" });
      setTimeout(() => setAlert(null), 4000);
    } catch (error) {
      console.error("❌ Error al eliminar colaborador:", error);
      setAlert({ type: "danger", message: "Error al eliminar colaborador ❌" });
      setTimeout(() => setAlert(null), 4000);
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  // === Editar colaborador ===
  const handleEditClick = (user) => {
    setEditTarget(user);
    setShowEditModal(true);
  };

  const handleEditSave = async (id, updatedData) => {
    try {
      await updateColaborador(id, updatedData);
      setData(data.map(d => (d.id === id ? { ...d, ...updatedData } : d)));
      setAlert({ type: "success", message: "Colaborador actualizado ✅" });
      setTimeout(() => setAlert(null), 4000);
    } catch (error) {
      console.error("❌ Error al actualizar colaborador:", error);
      setAlert({ type: "danger", message: "Error al actualizar colaborador ❌" });
      setTimeout(() => setAlert(null), 4000);
    }
  };

  return (
    <div className={styles.usersPageContainer}>
      <div className={styles.usersNav}>
        <button className={styles.addUserButton} onClick={() => setShowModal(true)}>
          <span className="material-icons">person_add</span>
          Registrar Usuario
        </button>
        <span className={styles.loggedUser}>Toña</span>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} mt-3`} role="alert" style={{ fontFamily: "Arial, sans-serif", fontWeight: 500 }}>
          {alert.message}
        </div>
      )}

      <h2 className={styles.pageTitle}>Administrar Usuarios</h2>

      <div className={styles.crudContainer}>
        <table className={styles.crudTable}>
          <thead>
            <tr>
              {data[0] && Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {Object.values(item).map((value, idx) => (
                  <td key={idx}>{value?.toString()}</td>
                ))}
                <td>
                  <button onClick={() => handleEditClick(item)}>
                    <span className="material-icons">edit</span>
                  </button>
                  <button onClick={() => confirmDelete(item.id)}>
                    <span className="material-icons">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <RegisterUserModal onClose={() => setShowModal(false)} onSave={handleAdd} />}

      {showDeleteModal && (
        <div className={styles.deleteModalOverlay}>
          <div className={styles.deleteModal}>
            <h3>¿Eliminar colaborador?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <div className={styles.deleteModalButtons}>
              <button className={styles.cancelButton} onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button className={styles.deleteButton} onClick={handleDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editTarget && (
        <EditUserModal user={editTarget} onClose={() => setShowEditModal(false)} onSave={handleEditSave} />
      )}
    </div>
  );
}
