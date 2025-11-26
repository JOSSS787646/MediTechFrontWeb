import React, { useState, useEffect } from "react";
import styles from "../../styles/Components/RegisterUserModal.module.css"; // importa tu CSS existente

export default function EditProfileModal({ isOpen, onClose, userData, onSave }) {
  // Estados locales para los campos editables
  const [nombre, setNombre] = useState(userData?.nombre || "");
  const [apellidoPaterno, setApellidoPaterno] = useState(userData?.apellidoPaterno || "");
  const [apellidoMaterno, setApellidoMaterno] = useState(userData?.apellidoMaterno || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [telefono, setTelefono] = useState(userData?.telefono || "");
  const [direccion, setDireccion] = useState(userData?.direccion || "");

  // Validación simple
  const [errors, setErrors] = useState({});

  // Actualiza los estados si cambia userData desde fuera
  useEffect(() => {
    setNombre(userData?.nombre || "");
    setApellidoPaterno(userData?.apellidoPaterno || "");
    setApellidoMaterno(userData?.apellidoMaterno || "");
    setEmail(userData?.email || "");
    setTelefono(userData?.telefono || "");
    setDireccion(userData?.direccion || "");
  }, [userData]);

  const handleSave = () => {
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!apellidoPaterno.trim()) newErrors.apellidoPaterno = "El apellido paterno es requerido";
    if (!apellidoMaterno.trim()) newErrors.apellidoMaterno = "El apellido materno es requerido";
    if (!email.trim()) newErrors.email = "El correo es requerido";
    if (!telefono.trim()) newErrors.telefono = "El teléfono es requerido";
    if (!direccion.trim()) newErrors.direccion = "La dirección es requerida";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        ...userData,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        email,
        telefono,
        direccion,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${styles.animateIn}`}
        onClick={(e) => e.stopPropagation()} // evita cerrar al hacer click dentro
      >
        <h2 className={styles.title}>Editar Perfil</h2>

        <div className={styles.fieldsGrid}>
          <div className={styles.field}>
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={errors.nombre ? styles.inputError : ""}
            />
            {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
          </div>

          <div className={styles.field}>
            <label>Apellido Paterno</label>
            <input
              type="text"
              value={apellidoPaterno}
              onChange={(e) => setApellidoPaterno(e.target.value)}
              className={errors.apellidoPaterno ? styles.inputError : ""}
            />
            {errors.apellidoPaterno && <span className={styles.error}>{errors.apellidoPaterno}</span>}
          </div>

          <div className={styles.field}>
            <label>Apellido Materno</label>
            <input
              type="text"
              value={apellidoMaterno}
              onChange={(e) => setApellidoMaterno(e.target.value)}
              className={errors.apellidoMaterno ? styles.inputError : ""}
            />
            {errors.apellidoMaterno && <span className={styles.error}>{errors.apellidoMaterno}</span>}
          </div>

          <div className={styles.field}>
            <label>Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? styles.inputError : ""}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label>Teléfono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={errors.telefono ? styles.inputError : ""}
            />
            {errors.telefono && <span className={styles.error}>{errors.telefono}</span>}
          </div>

          <div className={styles.field} style={{ gridColumn: "span 2" }}>
            <label>Dirección</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className={errors.direccion ? styles.inputError : ""}
            />
            {errors.direccion && <span className={styles.error}>{errors.direccion}</span>}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.saveButton} onClick={handleSave}>
            Guardar
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
