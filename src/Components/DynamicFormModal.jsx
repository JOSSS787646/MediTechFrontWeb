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

  // 🔹 Validar un solo campo en tiempo real
  const validateField = (field, value) => {
    if (field.required && !value?.toString().trim()) {
      return `El campo ${field.label} es obligatorio`;
    }
    if (field.validate) {
      const result = field.validate(value);
      if (result !== true) return result;
    }
    return "";
  };

  // 🔹 Manejar cambios de campo
  const handleChange = (key, value) => {
    const field = fields.find((f) => f.key === key);
    const transformed = field?.transform ? field.transform(value) : value;

    let newFormData = { ...formData };
    let newErrors = { ...errors };

    // Recalcular edad si cambia la fecha de nacimiento
    if (key === "fechaNacimiento") {
      const edadCalculada = calcularEdad(value);
      newFormData = {
        ...newFormData,
        [key]: transformed,
        edad: edadCalculada >= 0 ? edadCalculada : "",
      };
    } else {
      newFormData[key] = transformed;
    }

    // Validar el campo en tiempo real
    const errorMsg = validateField(field, transformed);
    if (errorMsg) newErrors[key] = errorMsg;
    else delete newErrors[key];

    // Validar dependencias (por ejemplo, edad calculada)
    if (key === "fechaNacimiento") {
      const edadField = fields.find((f) => f.key === "edad");
      if (edadField) delete newErrors["edad"];
    }

    setFormData(newFormData);
    setErrors(newErrors);
  };

  // 🔹 Validar todos los campos antes de guardar
  const validateAll = () => {
    const newErrors = {};
    fields.forEach((field) => {
      const value = formData[field.key];
      const errorMsg = validateField(field, value);
      if (errorMsg) newErrors[field.key] = errorMsg;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateAll()) return;
    onSave(formData);
  };

  // 🔹 Restricciones en tiempo real
  const handleInputRestriction = (e, field) => {
    const { key } = field;
    let value = e.target.value;

    // Solo letras
    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(key)) {
      value = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    }

    // Solo números
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

                {field.type === "select" ? (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className={`${styles.input} ${styles.select} ${
                      errors[field.key] ? styles.inputError : ""
                    }`}
                  >
                    <option value="">Seleccione...</option>
                    {field.options?.map((opt, idx) =>
                      typeof opt === "object" && opt !== null ? (
                        <option key={idx} value={opt.value}>
                          {opt.label}
                        </option>
                      ) : (
                        <option key={idx} value={opt}>
                          {opt}
                        </option>
                      )
                    )}
                  </select>
                ) : (
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

                {field.key === "edad" && (
                  <small className={styles.hintText}>
                    ℹ️ Se calcula automáticamente al seleccionar la fecha de nacimiento
                  </small>
                )}

                {/* 🔸 Mostrar error en tiempo real */}
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
