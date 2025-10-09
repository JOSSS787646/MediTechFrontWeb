// frontend/src/components/TextField.jsx
import React from "react";
import styles from "../styles/components/RegisterUserModal.module.css"; // o el que uses

export default function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  className = "",
}) {
  return (
    <div className={`${styles.field} ${className}`}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? styles.inputError : ""}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
