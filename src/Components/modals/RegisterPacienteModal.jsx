import React, { useState, useEffect } from "react";
import styles from "../../styles/Components/RegisterPacienteModal.module.css";
import { addPaciente } from "../../Api/paciente";
import Swal from "sweetalert2";

export default function RegisterPacienteModal({ onClose, onSave }) {
  const TODAY = new Date().toISOString().split("T")[0];
  const fecha18AniosAtras = new Date();
  fecha18AniosAtras.setFullYear(fecha18AniosAtras.getFullYear() - 18);
  const MAX_FECHA_NAC = fecha18AniosAtras.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    edad: "",
    fechaNacimiento: "",
    curp: "",
    email: "",
    telefono: "",
    genero: "",
    contrasenia: "",
  });

  const [errors, setErrors] = useState({});

  // === VALIDACIÓN INDIVIDUAL DE CAMPOS (TIEMPO REAL) ===
  const validarCampo = (name, value) => {
    let error = "";

    switch (name) {
      case "nombre":
        if (!value.trim()) error = "El nombre es obligatorio";
        break;

      case "apellidoPaterno":
        if (!value.trim()) error = "El apellido paterno es obligatorio";
        break;

      case "curp":
        if (!value.trim()) error = "La CURP es obligatoria";
        else if (!/^[A-Z0-9]{18}$/.test(value))
          error = "La CURP debe tener 18 caracteres alfanuméricos";
        break;

      case "email":
        if (!value.trim()) error = "El correo electrónico es obligatorio";
        else if (!value.includes("@") || !value.includes("."))
          error = "Correo inválido (ejemplo@correo.com)";
        break;

      case "telefono":
        if (!value.trim()) error = "El teléfono es obligatorio";
        else if (!/^\d{10}$/.test(value))
          error = "Debe contener exactamente 10 dígitos";
        break;

      case "genero":
        if (!value) error = "Selecciona un género";
        break;

      case "contrasenia":
        if (!value.trim()) error = "La contraseña es obligatoria";
        else if (value.length < 6)
          error = "Debe tener al menos 6 caracteres";
        break;
    }

    return error;
  };

  // === EDAD AUTOMÁTICA ===
  useEffect(() => {
    if (formData.fechaNacimiento) {
      const fechaNac = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      const m = hoy.getMonth() - fechaNac.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) edad--;

      setFormData((prev) => ({ ...prev, edad: edad >= 0 ? edad : "" }));
    }
  }, [formData.fechaNacimiento]);

  // === VALIDACIONES AL PRESIONAR GUARDAR ===
  const validar = () => {
    const newErrors = {};

    Object.keys(formData).forEach((campo) => {
      const error = validarCampo(campo, formData[campo]);
      if (error) newErrors[campo] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // === HANDLE CHANGE CON VALIDACIÓN AUTOMÁTICA ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case "nombre":
      case "apellidoPaterno":
      case "apellidoMaterno":
        formattedValue = value
          .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        break;

      case "curp":
        formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 18);
        break;

      case "email":
        formattedValue = value.trim();
        break;

      case "telefono":
        formattedValue = value.replace(/\D/g, "").slice(0, 10);
        break;
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    // Validación en tiempo real
    const error = validarCampo(name, formattedValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // === GUARDAR PACIENTE ===
  const handleSave = async () => {
    if (!validar()) return;

    try {
      const pacienteData = {
        ...formData,
        edad: parseInt(formData.edad) || 0,
      };

      await addPaciente(pacienteData);

      Swal.fire({
        icon: "success",
        title: "Paciente registrado",
        text: `${formData.nombre} fue agregado correctamente.`,
        confirmButtonColor: "#1e5e5c",
      });

      onSave?.();
      onClose?.();
    } catch (error) {
      console.error("❌ Error al agregar paciente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar el paciente",
        confirmButtonColor: "#1e5e5c",
      });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          <span className="material-icons">person_add</span> Registrar Paciente
        </h2>

        <div className={styles.scrollContainer}>
          <div className={styles.fieldsGrid}>
            
            {/* NOMBRE */}
            <div className={styles.fieldWrapper}>
              <label className={styles.label}>Nombre*</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`${styles.input} ${errors.nombre ? styles.inputError : ""}`}
              />
              {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
            </div>

            {/* APELLIDO PATERNO */}
            <div className={styles.fieldWrapper}>
              <label className={styles.label}>Apellido Paterno*</label>
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                className={`${styles.input} ${errors.apellidoPaterno ? styles.inputError : ""}`}
              />
              {errors.apellidoPaterno && (
                <span className={styles.error}>{errors.apellidoPaterno}</span>
              )}
            </div>

            {/* APELLIDO MATERNO */}
            <div className={styles.fieldWrapper}>
              <label className={styles.label}>Apellido Materno</label>
              <input
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* CURP */}
            <div className={styles.fieldWrapper}>
              <label className={styles.label}>CURP*</label>
              <input
                type="text"
                name="curp"
                value={formData.curp}
                onChange={handleChange}
                className={`${styles.input} ${errors.curp ? styles.inputError : ""}`}
              />
              {errors.curp && <span className={styles.error}>{errors.curp}</span>}
            </div>

            {/* EMAIL */}
            <div className={styles.fieldWrapper}>
              <label className={styles.label}>Correo Electrónico*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                placeholder="example@correo.com"
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            {/* CONTRASEÑA */}
            <div className={styles.fieldWrapper}>
              <label className={styles.label}>Contraseña*</label>
              <input
                type="password"
                name="contrasenia"
                value={formData.contrasenia}
                onChange={handleChange}
                className={`${styles.input} ${errors.contrasenia ? styles.inputError : ""}`}
              />
              {errors.contrasenia && (
                <span className={styles.error}>{errors.contrasenia}</span>
              )}
            </div>

            {/* TELEFONO */}
            <div className={styles.fieldWrapper}>
              <label className={styles.label}>Teléfono (10 dígitos)*</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`${styles.input} ${errors.telefono ? styles.inputError : ""}`}
              />
              {errors.telefono && <span className={styles.error}>{errors.telefono}</span>}
            </div>

            {/* GENERO */}
            <div className={styles.fieldWrapper}>
              <label className={styles.label}>Género*</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className={`${styles.input} ${styles.select} ${errors.genero ? styles.inputError : ""}`}
              >
                <option value="">Selecciona</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.genero && <span className={styles.error}>{errors.genero}</span>}
            </div>

            {/* FECHA NACIMIENTO */}
            <div className={styles.fieldWrapper}>
              <label className={styles.label}>Fecha de Nacimiento*</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                max={MAX_FECHA_NAC}
                className={styles.input}
              />
            </div>

            {/* EDAD */}
            <div className={styles.fieldWrapper}>
              <label className={styles.label}>Edad</label>
              <input
                type="number"
                name="edad"
                value={formData.edad}
                readOnly
                className={styles.input}
              />
            </div>

          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>Cancelar</button>
          <button className={styles.saveButton} onClick={handleSave}>Guardar Paciente</button>
        </div>
      </div>
    </div>
  );
}
