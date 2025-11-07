import React from "react";
import DynamicFormModal from "../DynamicFormModal";
import { createColaborador } from "../../Api/colaborator";
import Swal from "sweetalert2";

export default function RegisterUserModal({ onClose, onSave }) {
  const today = new Date().toISOString().split("T")[0];
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const maxFechaNacimiento = eighteenYearsAgo.toISOString().split("T")[0];

  // ✅ Validadores reutilizables
  const soloLetras = (val) =>
    !val || /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(val)
      ? true
      : "Solo se permiten letras y espacios";

  const ochoDigitos = (val) =>
    !val || /^\d{8}$/.test(val)
      ? true
      : "Debe contener exactamente 8 dígitos numéricos";

  const curpValida = (val) =>
    /^[A-Z0-9]{18}$/.test(val || "")
      ? true
      : "Debe tener 18 caracteres alfanuméricos en mayúsculas";

  const emailValido = (val) =>
    !val ||
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val)
      ? true
      : "Correo electrónico inválido";

  const diezDigitos = (val) =>
    !val || /^\d{10}$/.test(val)
      ? true
      : "Debe tener exactamente 10 dígitos";

  // ✅ Campos del formulario
  const colaboradorFields = [
    {
      key: "nombre",
      label: "Nombre",
      required: true,
      placeholder: "Ejemplo: Juan",
      transform: (val) =>
        val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : "",
      validate: soloLetras,
    },
    {
      key: "apellidoPaterno",
      label: "Apellido Paterno",
      required: true,
      transform: (val) =>
        val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : "",
      validate: soloLetras,
    },
    {
      key: "apellidoMaterno",
      label: "Apellido Materno",
      required: true,
      transform: (val) =>
        val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : "",
      validate: soloLetras,
    },
    { key: "edad", label: "Edad", type: "number", required: true },
    {
      key: "fechaNacimiento",
      label: "Fecha de Nacimiento",
      type: "date",
      required: true,
      max: maxFechaNacimiento,
    },
    { key: "direccion", label: "Dirección" },
    {
      key: "curp",
      label: "CURP",
      required: true,
      transform: (val) => (val ? val.toUpperCase().slice(0, 18) : ""),
      validate: curpValida,
    },
    {
      key: "email",
      label: "Correo Electrónico",
      type: "email",
      placeholder: "correo@ejemplo.com",
      validate: emailValido,
    },
    {
      key: "cedulaProfesional", // visible como Cédula, backend recibirá matriculaProfesional
      label: "Cédula Profesional",
      placeholder: "Ejemplo: 12345678",
      transform: (val) => (val ? val.replace(/\D/g, "").slice(0, 8) : ""),
      validate: ochoDigitos,
    },
    {
      key: "telefono",
      label: "Teléfono",
      type: "tel",
      transform: (val) => (val ? val.replace(/\D/g, "").slice(0, 10) : ""),
      validate: diezDigitos,
    },
    {
      key: "genero",
      label: "Género",
      type: "select",
      options: ["Hombre", "Mujer", "Otro"],
      required: true,
    },
    {
      key: "fechaContrato",
      label: "Fecha de Contrato",
      type: "date",
      min: today,
    },
    {
      key: "licencia",
      label: "Licencia",
      placeholder: "Ejemplo: 87654321",
      transform: (val) => (val ? val.replace(/\D/g, "").slice(0, 8) : ""),
      validate: ochoDigitos,
    },
  ];

  // ✅ Guardar colaborador
  const handleSave = async (data) => {
    try {
      const processedData = {};
      colaboradorFields.forEach((field) => {
        const value = data[field.key];
        processedData[field.key] = field.transform ? field.transform(value) : value;
      });

      // Validaciones
      for (const field of colaboradorFields) {
        const value = processedData[field.key];
        if (field.required && !value) {
          throw new Error(`El campo "${field.label}" es obligatorio`);
        }
        if (field.validate) {
          const valid = field.validate(value);
          if (valid !== true) throw new Error(`Error en ${field.label}: ${valid}`);
        }
      }

      const colaboradorData = {
        id: 0,
        iD_Cede: 1, // ✅ nombre exacto del backend
        ...processedData,
        edad: parseInt(processedData.edad || 0),
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        esActivo: true,
      };

      // 🔁 Mapear "Cédula Profesional" → "matriculaProfesional"
      if (colaboradorData.cedulaProfesional) {
        colaboradorData.matriculaProfesional = colaboradorData.cedulaProfesional;
        delete colaboradorData.cedulaProfesional;
      }

      // 🔹 Evitar enviar campos vacíos
      Object.keys(colaboradorData).forEach((k) => {
        if (colaboradorData[k] === "" || colaboradorData[k] == null)
          delete colaboradorData[k];
      });

      console.log("📤 Datos enviados al backend:", colaboradorData);
      const response = await createColaborador(colaboradorData);
      console.log("✅ Respuesta backend:", response);

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Colaborador registrado correctamente ✅",
        background: "#ffffff",
        color: "#000000",
        confirmButtonColor: "#4B908E",
        timer: 2000,
        timerProgressBar: true,
      });

      onSave?.(response);
      onClose();
    } catch (error) {
      console.error("❌ Error al registrar colaborador:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo registrar el colaborador",
        background: "#ffffff",
        color: "#005124FF",
        confirmButtonColor: "#4B908E",
      });
    }
  };

  return (
    <DynamicFormModal
      title="Registrar Colaborador"
      fields={colaboradorFields}
      onClose={onClose}
      onSave={handleSave}
    />
  );
}
