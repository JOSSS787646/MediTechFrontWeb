import React, { useEffect, useState } from "react";
import DynamicFormModal from "../DynamicFormModal";
import { createColaborador } from "../../Api/colaborator";
import { getCedes } from "../../Api/cede";
import { getTiposColaboradores } from "../../Api/tipoColaborador";
import { getEspecialidades } from "../../Api/especialidad";
import Swal from "sweetalert2";

export default function RegisterUserModal({ onClose, onSave }) {
  const [cedes, setCedes] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const maxFechaNacimiento = eighteenYearsAgo.toISOString().split("T")[0];

  // === Cargar catálogos ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cedesData, tiposData, especialidadesData] = await Promise.all([
          getCedes(),
          getTiposColaboradores(),
          getEspecialidades(),
        ]);

        console.log("📋 Cedes:", cedesData);
        console.log("📋 Tipos Colaborador:", tiposData);
        console.log("📋 Especialidades:", especialidadesData);

        setCedes(cedesData || []);
        setTipos(tiposData || []);
        setEspecialidades(especialidadesData || []);
      } catch (error) {
        console.error("❌ Error al cargar catálogos:", error);
        Swal.fire("Error", "No se pudieron cargar los catálogos", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // === Validadores ===
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

  // === Campos del formulario ===
  const colaboradorFields = [
    {
      key: "nombreUsuario",
      label: "Nombre de Usuario",
      required: true,
      placeholder: "Usuario para inicio de sesión",
    },
    {
      key: "contrasenia",
      label: "Contraseña",
      required: true,
      type: "password",
      placeholder: "Contraseña segura",
    },
    {
      key: "nombre",
      label: "Nombre",
      required: true,
      validate: soloLetras,
      transform: (v) =>
        v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : "",
    },
    {
      key: "apellidoPaterno",
      label: "Apellido Paterno",
      required: true,
      validate: soloLetras,
      transform: (v) =>
        v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : "",
    },
    {
      key: "apellidoMaterno",
      label: "Apellido Materno",
      required: true,
      validate: soloLetras,
      transform: (v) =>
        v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : "",
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
      validate: curpValida,
      transform: (v) => (v ? v.toUpperCase().slice(0, 18) : ""),
    },
    {
      key: "email",
      label: "Correo Electrónico",
      type: "email",
      validate: emailValido,
    },
    {
      key: "cedulaProfesional",
      label: "Cédula Profesional",
      transform: (v) => (v ? v.replace(/\D/g, "").slice(0, 8) : ""),
      validate: ochoDigitos,
    },
    {
      key: "telefono",
      label: "Teléfono",
      type: "tel",
      transform: (v) => (v ? v.replace(/\D/g, "").slice(0, 10) : ""),
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
      transform: (v) => (v ? v.replace(/\D/g, "").slice(0, 8) : ""),
      validate: ochoDigitos,
    },

    // === Selects dinámicos actualizados ===
    {
      key: "iD_Cede",
      label: "Cede",
      type: "select",
      required: true,
      options: cedes.map((c) => ({
        label: c.ciudad ?? "Sin ciudad",
        value: c.id,
      })),
    },
    {
      key: "iD_TipoColaborador",
      label: "Tipo de Colaborador",
      type: "select",
      required: true,
      // 👇 usa la propiedad "tipo" del backend
      options: tipos.map((t) => ({
        label: t.tipo ?? `Tipo ${t.id}`,
        value: t.id,
      })),
    },
    {
      key: "iD_Especialidad",
      label: "Especialidad",
      type: "select",
      required: true,
      options: especialidades.map((e) => ({
        label: e.nombre ?? `Especialidad ${e.id}`,
        value: e.id,
      })),
    },
  ];

  // === Guardar colaborador ===
  const handleSave = async (data) => {
    try {
      const processed = {};
      colaboradorFields.forEach((f) => {
        const value = data[f.key];
        processed[f.key] = f.transform ? f.transform(value) : value;
      });

      for (const f of colaboradorFields) {
        if (f.required && !processed[f.key])
          throw new Error(`El campo "${f.label}" es obligatorio`);
        if (f.validate) {
          const res = f.validate(processed[f.key]);
          if (res !== true) throw new Error(`${f.label}: ${res}`);
        }
      }

      const payload = {
        ...processed,
        edad: parseInt(processed.edad || 0),
        esActivo: true,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
      };

      if (payload.cedulaProfesional) {
        payload.matriculaProfesional = payload.cedulaProfesional;
        delete payload.cedulaProfesional;
      }

      console.log("📤 Enviando al backend:", payload);
      const response = await createColaborador(payload);

      Swal.fire({
        icon: "success",
        title: "¡Colaborador registrado!",
        text: "El registro se completó correctamente ✅",
        confirmButtonColor: "#1e5e5c",
      });

      onSave?.(response);
      onClose();
    } catch (error) {
      console.error("❌ Error al registrar:", error);
      Swal.fire("Error", error.message || "No se pudo registrar el colaborador", "error");
    }
  };

  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Cargando catálogos...</p>
      </div>
    );

  return (
    <DynamicFormModal
      title="Registrar Colaborador"
      fields={colaboradorFields}
      onClose={onClose}
      onSave={handleSave}
    />
  );
}
