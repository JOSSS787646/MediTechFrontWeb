import React from "react";
import styles from "../../styles/Components/RegisterUserModal.module.css";

export default function DeleteUserModal({ nombre, onConfirm, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Desactivar usuario</h2>

        <p style={{ textAlign: "center", fontSize: "1rem", color: "#444", marginBottom: "20px" }}>
          ¿Estás seguro que deseas desactivar al colaborador{" "}
          <strong>{nombre}</strong>?<br />
          Podrás verlo después en la sección de <strong>Usuarios inactivos</strong>.
        </p>

        <div className={styles.actions} style={{ justifyContent: "center" }}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={styles.saveButton}
            style={{ backgroundColor: "#c0392b" }}
            onClick={onConfirm}
          >
            Desactivar
          </button>
        </div>
      </div>
    </div>
  );
}
//cambios de la toña