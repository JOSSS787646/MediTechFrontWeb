// frontend/src/components/TextField.jsx
import React from "react";
import styles from "../styles/Components/RegisterUserModal.module.css"; 

export default function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  className = "",
  disabled = false,
  checked, // para checkboxes
}) {
  return (
    <div className={`${styles.fieldWrapper} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      {type === "checkbox" ? (
        <input
          type="checkbox"
          checked={checked || false}
          onChange={onChange}
          disabled={disabled}
          className={styles.checkboxInput}
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          style={{
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
      )}

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
