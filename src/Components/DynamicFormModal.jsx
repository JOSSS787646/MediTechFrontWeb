// DynamicFormModal.jsx
import React, { useState } from "react";
import styles from "../styles/Components/RegisterUserModal.module.css";

export default function DynamicFormModal({ title, fields, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // 🔹 Calcular edad automáticamente
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return "";
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
    return edad;
  };

  // 🔹 Manejar cambios de campo
  const handleChange = (key, value) => {
    const field = fields.find((f) => f.key === key);
    const transformed = field?.transform ? field.transform(value) : value;

    if (key === "fechaNacimiento") {
      const edadCalculada = calcularEdad(value);
      setFormData((prev) => ({
        ...prev,
        [key]: transformed,
        edad: edadCalculada >= 0 ? edadCalculada : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: transformed }));
    }
  };

  // 🔹 Validar antes de guardar
  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      const value = formData[field.key];
      if (field.required && !value?.toString().trim()) {
        newErrors[field.key] = `El campo ${field.label} es obligatorio`;
      } else if (field.validate) {
        const valid = field.validate(value);
        if (valid !== true) newErrors[field.key] = valid;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(formData);
  };

  // 🔹 Restricciones de escritura en tiempo real
  const handleInputRestriction = (e, field) => {
    const { key } = field;
    let value = e.target.value;

    // 🔸 Solo letras
    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(key)) {
      value = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    }

    // 🔸 Solo números (con límites)
    if (["cedulaProfesional", "licencia", "telefono", "edad"].includes(key)) {
      value = value.replace(/\D/g, "");

      if (["cedulaProfesional", "licencia"].includes(key)) value = value.slice(0, 8);
      if (key === "telefono") value = value.slice(0, 10);
      if (key === "edad") value = value.slice(0, 3);
    }

    handleChange(key, value);
  };

  const handlePaste = (e, field) => {
    const paste = e.clipboardData.getData("text");
    const { key } = field;

    if (["cedulaProfesional", "licencia", "telefono", "edad"].includes(key)) {
      if (!/^\d+$/.test(paste) || paste.length > 10) e.preventDefault();
    }

    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(key)) {
      if (/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/.test(paste)) e.preventDefault();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles.animateIn}`}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.scrollContainer}>
          <div className={styles.fieldsGrid}>
            {fields.map((field) => (
              <div key={field.key} className={styles.fieldWrapper}>
                <label
                  className={styles.label}
                  title={field.key === "edad" ? "Este campo se calcula automáticamente" : ""}
                >
                  {field.label}
                  {field.required && <span className={styles.required}>*</span>}
                </label>

                {/* 🔹 Campo tipo select */}
                {field.type === "select" ? (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className={`${styles.input} ${styles.select}`}
                  >
                    <option value="">Seleccione...</option>
                    {field.options?.map((opt, idx) => {
                      // Permite opciones tipo string o tipo objeto {label, value}
                      if (typeof opt === "object" && opt !== null) {
                        return (
                          <option key={idx} value={opt.value}>
                            {opt.label}
                          </option>
                        );
                      }
                      return (
                        <option key={idx} value={opt}>
                          {opt}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  /* 🔹 Campo tipo input */
                  <input
                    type={field.type || "text"}
                    value={formData[field.key] || ""}
                    placeholder={
                      field.key === "edad"
                        ? "Se calcula automáticamente"
                        : field.placeholder || ""
                    }
                    onChange={(e) => handleInputRestriction(e, field)}
                    onPaste={(e) => handlePaste(e, field)}
                    min={field.min}
                    max={field.max}
                    readOnly={field.key === "edad"}
                    className={`${styles.input} ${
                      errors[field.key] ? styles.inputError : ""
                    }`}
                  />
                )}

                {/* 🔸 Mensaje aclaratorio debajo del campo Edad */}
                {field.key === "edad" && (
                  <small className={styles.hintText}>
                    ℹ️ Se calcula automáticamente al seleccionar la fecha de nacimiento
                  </small>
                )}

                {errors[field.key] && (
                  <p className={styles.error}>{errors[field.key]}</p>
                )}
              </div>
            ))}
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
