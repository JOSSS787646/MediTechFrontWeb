/* EditUserModal.jsx — Versión corregida 100% funcional */
import React, { useState, useEffect } from "react";
import styles from "../../styles/Components/RegisterUserModal.module.css";
import TextField from "../TextField";

import { getTiposColaboradores } from "../../Api/tipoColaborador";
import { getEspecialidades } from "../../Api/especialidad";
import { getCedes } from "../../Api/cede";

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

        // 🔥⚠️ CAMPOS CORRECTOS (que coinciden con backend)
        iD_Cede: Number(user.iD_Cede) || 1,
        iD_TipoColaborador: Number(user.iD_TipoColaborador) || 1,
        iD_Especialidad: Number(user.iD_Especialidad) || 1,

        esActivo: user.esActivo ?? true,
      });
    }
  }, [user]);

  // ==============================
  // Validaciones
  // ==============================
  const validators = {
    nombre: (val) =>
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(val || "")
        ? ""
        : "Solo se permiten letras y espacios.",
    apellidoPaterno: (val) =>
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(val || "")
        ? ""
        : "Solo se permiten letras y espacios.",
    apellidoMaterno: (val) =>
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(val || "")
        ? ""
        : "Solo se permiten letras y espacios.",
    curp: (val) =>
      /^[A-Z0-9]{18}$/.test(val || "")
        ? ""
        : "La CURP debe tener 18 caracteres en mayúsculas.",
    email: (val) =>
      !val || /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val)
        ? ""
        : "Correo electrónico inválido.",
    telefono: (val) =>
      /^\d{10}$/.test(val || "")
        ? ""
        : "Debe tener exactamente 10 dígitos numéricos.",
    matriculaProfesional: (val) =>
      !val || /^\d{8}$/.test(val)
        ? ""
        : "Debe contener 8 dígitos numéricos.",
    licencia: (val) =>
      !val || /^\d{8}$/.test(val)
        ? ""
        : "Debe contener 8 dígitos numéricos.",
  };

  // ==============================
  // Calcular edad automáticamente
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
  // Manejo de cambios en inputs
  // ==============================
  const handleChange = (key, value) => {
    let newValue = value;

    // Capitalizar campos textuales
    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(key)) {
      newValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

    if (key === "curp") newValue = value.toUpperCase().slice(0, 18);
    if (["telefono", "matriculaProfesional", "licencia"].includes(key))
      newValue = value.replace(/\D/g, "");

    if (key === "fechaNacimiento") {
      const edadCalculada = calcularEdad(newValue);
      setFormData((prev) => ({
        ...prev,
        [key]: newValue,
        edad: Number(edadCalculada),
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
  // Validar antes de guardar
  // ==============================
  const validateAll = () => {
    const newErrors = {};
    Object.keys(validators).forEach((key) => {
      const error = validators[key](formData[key]);
      if (error) newErrors[key] = error;
    });

    if (formData.edad && formData.edad < 18)
      newErrors.edad = "Debe ser mayor de edad (18 años o más).";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==============================
  // Guardar cambios (solo local)
  // ==============================
  const handleSave = () => {
    if (!validateAll()) {
      alert("⚠️ Corrige los errores antes de guardar.");
      return;
    }

    // Obtener texto del rol
    const tipoSeleccionado = tipos.find(
      (t) => t.id === Number(formData.iD_TipoColaborador)
    );

    const payload = {
      ...formData,

      // 🔥 Asegurar nombres correctos (coinciden con backend)
      iD_Cede: Number(formData.iD_Cede),
      iD_TipoColaborador: Number(formData.iD_TipoColaborador),
      iD_Especialidad: Number(formData.iD_Especialidad),

      // 🔥 Actualizar rol visible en la tabla
      rol: tipoSeleccionado?.tipo || user.rol,
    };

    onSave(user.id, payload, { guardarEnBackend: false });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles.animateIn}`}>
        <h2>Editar Colaborador</h2>

        <div className={styles.scrollContainer}>
          <div className={styles.fieldsGrid}>
            <TextField
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              error={errors.nombre}
            />

            <TextField
              label="Apellido Paterno"
              value={formData.apellidoPaterno}
              onChange={(e) =>
                handleChange("apellidoPaterno", e.target.value)
              }
              error={errors.apellidoPaterno}
            />

            <TextField
              label="Apellido Materno"
              value={formData.apellidoMaterno}
              onChange={(e) =>
                handleChange("apellidoMaterno", e.target.value)
              }
              error={errors.apellidoMaterno}
            />

            <TextField
              label="CURP"
              value={formData.curp}
              onChange={(e) => handleChange("curp", e.target.value)}
              error={errors.curp}
            />

            <TextField
              label="Correo electrónico"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
            />

            <TextField
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              error={errors.telefono}
            />

            <TextField
              label="Fecha de nacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) =>
                handleChange("fechaNacimiento", e.target.value)
              }
            />

            <TextField label="Edad" value={formData.edad} disabled />

            <TextField
              label="Fecha de contrato"
              type="date"
              value={formData.fechaContrato}
              onChange={(e) =>
                handleChange("fechaContrato", e.target.value)
              }
            />

            <TextField
              label="Dirección"
              value={formData.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
            />

            <TextField
              label="Matrícula profesional"
              value={formData.matriculaProfesional}
              onChange={(e) =>
                handleChange("matriculaProfesional", e.target.value)
              }
              error={errors.matriculaProfesional}
            />

            <TextField
              label="Licencia"
              value={formData.licencia}
              onChange={(e) => handleChange("licencia", e.target.value)}
              error={errors.licencia}
            />

            <TextField
              label="Género"
              value={formData.genero}
              onChange={(e) => handleChange("genero", e.target.value)}
            />

            {/* Tipo Colaborador */}
            <div className={styles.selectField}>
              <label>Tipo de colaborador</label>
              <select
                value={formData.iD_TipoColaborador}
                onChange={(e) =>
                  handleChange("iD_TipoColaborador", e.target.value)
                }
              >
                <option value="">Seleccione...</option>
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Cede */}
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

            {/* Especialidad */}
            <div className={styles.selectField}>
              <label>Especialidad</label>
              <select
                value={formData.iD_Especialidad}
                onChange={(e) =>
                  handleChange("iD_Especialidad", e.target.value)
                }
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
