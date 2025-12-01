/* EditUserModal.jsx — Versión con mensaje SweetAlert2 */
import React, { useState, useEffect } from "react";
import styles from "../../styles/Components/RegisterUserModal.module.css";
import TextField from "../TextField";

import { getTiposColaboradores } from "../../Api/tipoColaborador";
import { getEspecialidades } from "../../Api/especialidad";
import { getCedes } from "../../Api/cede";

// ✅ Import necesario para mostrar el mensaje
import Swal from "sweetalert2";

export default function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [tipos, setTipos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [cedes, setCedes] = useState([]);

  // ==============================
  // Cargar catálogos
  // ==============================
  useEffect(() => {
    const loadData = async () => {
      try {
        const [t, e, c] = await Promise.all([
          getTiposColaboradores(),
          getEspecialidades(),
          getCedes(),
        ]);
        setTipos(t);
        setEspecialidades(e);
        setCedes(c);
      } catch (error) {
        console.error("❌ Error cargando catálogos:", error);
      }
    };
    loadData();
  }, []);

  // ==============================
  // Inicializar datos del usuario
  // ==============================
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellidoPaterno: user.apellidoPaterno || "",
        apellidoMaterno: user.apellidoMaterno || "",
        curp: user.curp || "",
        email: user.email || "",
        edad: Number(user.edad) || 0,
        fechaNacimiento: user.fechaNacimiento
          ? new Date(user.fechaNacimiento).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        direccion: user.direccion || "",
        telefono: user.telefono || "",
        fechaContrato: user.fechaContrato
          ? new Date(user.fechaContrato).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        matriculaProfesional: user.matriculaProfesional || "",
        licencia: user.licencia || "",
        genero: user.genero || "No especificado",
        iD_Cede: Number(user.iD_Cede) || 1,
        iD_TipoColaborador: Number(user.iD_TipoColaborador) || 1,
        iD_Especialidad: Number(user.iD_Especialidad) || 1,
        esActivo: user.esActivo ?? true,
      });
    }
  }, [user]);

  // ==============================
  // VALIDADORES
  // ==============================
  const validators = {
    nombre: (val) =>
      !val ? "Ingresa el nombre." :
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(val) ? "" :
      "Solo se permiten letras.",

    apellidoPaterno: (val) =>
      !val ? "Ingresa el apellido paterno." :
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(val) ? "" :
      "Solo se permiten letras.",

    apellidoMaterno: (val) =>
      !val ? "Ingresa el apellido materno." :
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(val) ? "" :
      "Solo se permiten letras.",

    curp: (val) =>
      !val ? "Ingresa la CURP (18 caracteres)." :
      /^[A-Z0-9]{18}$/.test(val) ? "" :
      "La CURP debe tener 18 caracteres.",

    email: (val) =>
      !val ? "Ingresa tu correo." :
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val) ? "" :
      "Correo inválido.",

    telefono: (val) =>
      !val ? "Ingresa 10 dígitos." :
      /^\d{10}$/.test(val) ? "" :
      "Debe tener 10 dígitos.",

    matriculaProfesional: (val) =>
      !val ? "Ingresa 8 dígitos." :
      /^\d{8}$/.test(val) ? "" :
      "Debe tener 8 dígitos.",

    licencia: (val) =>
      !val ? "Ingresa 8 dígitos." :
      /^\d{8}$/.test(val) ? "" :
      "Debe tener 8 dígitos.",
  };

  // ==============================
  // Calcular edad
  // ==============================
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return "";
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad >= 0 ? edad : "";
  };

  // ==============================
  // Manejo de cambios con límites
  // ==============================
  const handleChange = (key, value) => {
    let newValue = value;

    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(key)) {
      newValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

    if (key === "curp") newValue = value.toUpperCase().slice(0, 18);
    if (key === "telefono") newValue = value.replace(/\D/g, "").slice(0, 10);
    if (key === "matriculaProfesional") newValue = value.replace(/\D/g, "").slice(0, 8);
    if (key === "licencia") newValue = value.replace(/\D/g, "").slice(0, 8);

    if (key === "fechaNacimiento") {
      const edadCalculada = calcularEdad(newValue);
      setFormData((prev) => ({
        ...prev,
        fechaNacimiento: newValue,
        edad: edadCalculada,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: newValue }));
    }

    if (validators[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: validators[key](newValue),
      }));
    }
  };

  // ==============================
  // Validación final
  // ==============================
  const validateAll = () => {
    const newErrors = {};

    Object.keys(validators).forEach((key) => {
      const error = validators[key](formData[key]);
      if (error) newErrors[key] = error;
    });

    if (formData.edad < 18) newErrors.edad = "Debe ser mayor de edad.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==============================
  // Guardar cambios
  // ==============================
  const handleSave = () => {
    if (!validateAll()) {
      alert("⚠️ Corrige los errores antes de guardar.");
      return;
    }

    const tipoSeleccionado = tipos.find(
      (t) => t.id === Number(formData.iD_TipoColaborador)
    );

    const payload = {
      ...formData,
      iD_Cede: Number(formData.iD_Cede),
      iD_TipoColaborador: Number(formData.iD_TipoColaborador),
      iD_Especialidad: Number(formData.iD_Especialidad),
      rol: tipoSeleccionado?.tipo || user.rol,
    };

    onSave(user.id, payload, { guardarEnBackend: false });

    // ✅ Mensaje como el de registrar
    Swal.fire({
      icon: "success",
      title: "¡Cambios guardados!",
      text: "El colaborador se modificó correctamente ✅",
      confirmButtonColor: "#1e5e5c",
    });

    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles.animateIn}`}>
        <h2>Editar Colaborador</h2>

        <div className={styles.scrollContainer}>
          <div className={styles.fieldsGrid}>

            {[
              "nombre",
              "apellidoPaterno",
              "apellidoMaterno",
              "curp",
              "email",
              "telefono",
              "direccion",
              "matriculaProfesional",
              "licencia",
              "genero"
            ].map((field) => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                error={errors[field]}
              />
            ))}

            <TextField
              label="Fecha de nacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
            />

            <TextField label="Edad" value={formData.edad} disabled />

            <TextField
              label="Fecha de contrato"
              type="date"
              value={formData.fechaContrato}
              onChange={(e) => handleChange("fechaContrato", e.target.value)}
            />

            <div className={styles.selectField}>
              <label>Tipo de colaborador</label>
              <select
                value={formData.iD_TipoColaborador}
                onChange={(e) => handleChange("iD_TipoColaborador", e.target.value)}
              >
                <option value="">Seleccione...</option>
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.selectField}>
              <label>Cede</label>
              <select
                value={formData.iD_Cede}
                onChange={(e) => handleChange("iD_Cede", e.target.value)}
              >
                <option value="">Seleccione...</option>
                {cedes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.ciudad}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.selectField}>
              <label>Especialidad</label>
              <select
                value={formData.iD_Especialidad}
                onChange={(e) => handleChange("iD_Especialidad", e.target.value)}
              >
                <option value="">Seleccione...</option>
                {especialidades.map((esp) => (
                  <option key={esp.id} value={esp.id}>
                    {esp.nombre}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.saveButton} onClick={handleSave}>
            Guardar cambios
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
