import React from "react";
import DynamicFormModal from "../DynamicFormModal";
import { createColaborador } from "../../Api/colaborator";
import Swal from "sweetalert2";

export default function RegisterColaboradorModal({ onClose }) {
    const colaboradorFields = [
        { key: "nombre", label: "Nombre", required: true, placeholder: "Ejemplo: Juan" },
        { key: "apellidoPaterno", label: "Apellido Paterno", required: true },
        { key: "apellidoMaterno", label: "Apellido Materno", required: true },
        { key: "edad", label: "Edad", type: "number", required: true },
        { key: "fechaNacimiento", label: "Fecha de Nacimiento", type: "date" },
        { key: "direccion", label: "Dirección" },
        { key: "curp", label: "CURP" },
        { key: "email", label: "Correo Electrónico", type: "email" },
        { key: "matriculaProfesional", label: "Matrícula Profesional" },
        { key: "telefono", label: "Teléfono" },
        { key: "genero", label: "Género" },
        { key: "fechaContrato", label: "Fecha de Contrato", type: "date" },
        { key: "licencia", label: "Licencia" },
    ];

    const handleSave = async (data) => {
        try {
            const colaboradorData = {
                id: 0,
                iD_Cede: 1,
                ...data,
                edad: parseInt(data.edad || 0),
                fechaCreacion: new Date().toISOString(),
                fechaActualizacion: new Date().toISOString(),
                esActivo: true,
            };

            console.log("📤 Datos enviados:", colaboradorData);

            const response = await createColaborador(colaboradorData);
            console.log("✅ Respuesta backend:", response);

            // ALERTA ESTÉTICA BLANCA CON BOTÓN 4B908E Y DESAPARECE EN 2 SEGUNDOS
            Swal.fire({
                title: "¡Éxito!",
                text: "Colaborador registrado correctamente",
                icon: "success",
                background: "#ffffff",
                color: "#000000",
                confirmButtonColor: "#4B908E",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: true,
            });

            onClose();
        } catch (error) {
            console.error("❌ Error al registrar:", error);

            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                background: "#ffffff",
                color: "#005124FF",
                confirmButtonColor: "#4B908E",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: true,
                customClass: {
                    title: "swal-title-serif",
                    content: "swal-content-serif",
                    confirmButton: "swal-button-serif"
                }
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
