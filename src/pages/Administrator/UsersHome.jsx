import React, { useState } from "react";
import styles from "../../styles/pages/UsersHome.module.css";
import RegisterUserModal from "../../Components/modals/RegisterUserModal";

export default function UsersHome() {
  const [data, setData] = useState([
    { id: 1, nombre: "Juan Pérez", edad: 30, diagnostico: "Diabetes" },
    { id: 2, nombre: "María López", edad: 25, diagnostico: "Hipertensión" },
    { id: 3, nombre: "Carlos Gómez", edad: 40, diagnostico: "Asma" },
  ]);
  const [showModal, setShowModal] = useState(false);

  const handleAdd = () => setShowModal(true);

  const handleSave = (newUser) => {
    setData([...data, newUser]);
  };

  return (
    <div className={styles.usersPageContainer}>
      {/* ===== Nav superior ===== */}
      <div className={styles.usersNav}>
        <button className={styles.addUserButton} onClick={handleAdd}>
          <span className="material-icons">add_circle</span>
          Registrar Usuario
        </button>
        <span className={styles.loggedUser}>Toña</span>
      </div>

      {/* ===== Título debajo del nav ===== */}
      <h2 className={styles.pageTitle}>Administrar Usuarios</h2>

      {/* ===== Tabla CRUD ===== */}
      <div className={styles.crudContainer}>
        <table className={styles.crudTable}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Diagnóstico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{item.edad}</td>
                <td>{item.diagnostico}</td>
                <td>
                  <button onClick={() => alert("Editar " + item.id)}>Editar</button>
                  <button onClick={() => setData(data.filter((d) => d.id !== item.id))}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Modal de registro ===== */}
      {showModal && (
        <RegisterUserModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
