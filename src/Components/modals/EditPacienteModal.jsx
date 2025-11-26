import React, { useState, useEffect } from "react";
import styles from "../../styles/Components/Modal.module.css";
import Swal from "sweetalert2";

export default function EditPacienteModal({ paciente, onClose, onSave }) {
  const [form, setForm] = useState({ ...paciente });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Calcular edad automáticamente
  useEffect(() => {
    if (form.fechaNacimiento) {
      const fechaNac = new Date(form.fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      const m = hoy.getMonth() - fechaNac.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
      setForm((prev) => ({ ...prev, edad: edad >= 0 ? edad : "" }));
    }
  }, [form.fechaNacimiento]);

  // 🔹 Mantener los SweetAlert al frente
  const bringSwalFront = () => {
    const swalContainer = document.querySelector(".swal2-container");
    if (swalContainer) swalContainer.style.zIndex = "4000";
  };

  // 🔹 Cambiar valores con formato automático
  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    switch (name) {
      case "nombre":
      case "apellidoPaterno":
      case "apellidoMaterno":
        val = value
          .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        break;
      case "curp":
        val = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 18);
        break;
      case "telefono":
        val = value.replace(/\D/g, "").slice(0, 10);
        break;
      default:
        break;
    }

    setForm((prev) => ({ ...prev, [name]: val }));
  };

  // 🔹 Validar campos
  const validar = () => {
    const newErrors = {};

    if (!form.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!form.apellidoPaterno?.trim())
      newErrors.apellidoPaterno = "El apellido paterno es obligatorio";
    if (!form.curp?.trim()) newErrors.curp = "La CURP es obligatoria";
    if (form.curp && !/^[A-Z0-9]{18}$/.test(form.curp))
      newErrors.curp = "Debe tener 18 caracteres en mayúsculas";
    if (!form.email?.trim()) newErrors.email = "El correo electrónico es obligatorio";
    if (form.email && (!form.email.includes("@") || !form.email.includes(".")))
      newErrors.email = "Correo inválido (ejemplo@correo.com)";
    if (!form.telefono?.trim()) newErrors.telefono = "El teléfono es obligatorio";
    if (form.telefono && !/^\d{10}$/.test(form.telefono))
      newErrors.telefono = "Debe tener 10 dígitos numéricos";
    if (!form.genero) newErrors.genero = "Selecciona un género";
    if (form.contrasenia && form.contrasenia.length < 6)
      newErrors.contrasenia = "Debe tener al menos 6 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Guardar cambios
  const handleSubmit = async () => {
    if (!validar()) {
      Swal.fire({
        icon: "error",
        title: "Campos inválidos o incompletos",
        text: "Por favor corrige los errores antes de guardar.",
        confirmButtonColor: "#1e5e5c",
        backdrop: true,
        didOpen: bringSwalFront,
      });
      return;
    }

    const payload = { ...form };
    if (!payload.contrasenia) delete payload.contrasenia;

    const result = await Swal.fire({
      icon: "question",
      title: "¿Guardar cambios?",
      text: "Se actualizarán los datos del paciente.",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#1e5e5c",
      backdrop: true,
      didOpen: bringSwalFront,
    });

    if (!result.isConfirmed) return;

    const success = await onSave(paciente.id, payload);

    if (success) {
      Swal.fire({
        icon: "success",
        title: "Paciente actualizado ✅",
        text: "Los datos se guardaron correctamente.",
        confirmButtonColor: "#1e5e5c",
        timer: 1800,
        backdrop: true,
        didOpen: bringSwalFront,
      });
      onClose();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "Ocurrió un problema al guardar los cambios.",
        confirmButtonColor: "#1e5e5c",
        backdrop: true,
        didOpen: bringSwalFront,
      });
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>
          <span className="material-icons">edit</span> Editar Paciente
        </h2>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Nombre*</label>
            <input
              name="nombre"
              value={form.nombre || ""}
              onChange={handleChange}
              className={errors.nombre ? styles.inputError : ""}
            />
            {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Apellido Paterno*</label>
            <input
              name="apellidoPaterno"
              value={form.apellidoPaterno || ""}
              onChange={handleChange}
              className={errors.apellidoPaterno ? styles.inputError : ""}
            />
            {errors.apellidoPaterno && (
              <span className={styles.error}>{errors.apellidoPaterno}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Apellido Materno</label>
            <input
              name="apellidoMaterno"
              value={form.apellidoMaterno || ""}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>CURP*</label>
            <input
              name="curp"
              value={form.curp || ""}
              onChange={handleChange}
              maxLength="18"
              className={errors.curp ? styles.inputError : ""}
            />
            {errors.curp && <span className={styles.error}>{errors.curp}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Email*</label>
            <input
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              className={errors.email ? styles.inputError : ""}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Contraseña</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="contrasenia"
                value={form.contrasenia || ""}
                onChange={handleChange}
                placeholder="Nueva contraseña (opcional)"
                className={errors.contrasenia ? styles.inputError : ""}
              />
              <span
                className={`material-icons ${styles.eyeIcon}`}
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </div>
            {errors.contrasenia && (
              <span className={styles.error}>{errors.contrasenia}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Teléfono (10 dígitos)*</label>
            <input
              name="telefono"
              value={form.telefono || ""}
              onChange={handleChange}
              className={errors.telefono ? styles.inputError : ""}
            />
            {errors.telefono && <span className={styles.error}>{errors.telefono}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Género*</label>
            <select
              name="genero"
              value={form.genero || ""}
              onChange={handleChange}
              className={errors.genero ? styles.inputError : ""}
            >
              <option value="">Selecciona</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
            {errors.genero && <span className={styles.error}>{errors.genero}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento ? form.fechaNacimiento.split("T")[0] : ""}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Edad</label>
            <input name="edad" value={form.edad || ""} readOnly />
          </div>
        </div>

        <div className={styles.modalButtons}>
          <button className={styles.saveBtn} onClick={handleSubmit}>
            Guardar Cambios
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
