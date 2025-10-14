import React, { useState } from "react";
import styles from "../styles/Components/RegisterUserModal.module.css";
import TextField from "./TextField";

export default function DynamicFormModal({ title, fields, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Maneja cambios de todos los campos
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Validación dinámica según campos requeridos
  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.key]?.toString().trim()) {
        newErrors[field.key] = `El campo ${field.label} es obligatorio`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar y cerrar
  const handleSave = () => {
    if (!validate()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles.animateIn}`}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.fieldsGrid}>
          {fields.map((field) => (
            <TextField
              key={field.key}
              label={field.label}
              type={field.type || "text"}
              value={formData[field.key] || ""}
              placeholder={field.placeholder || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              error={errors[field.key]}
            />
          ))}
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
