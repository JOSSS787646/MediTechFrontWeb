import React, { useState, useEffect } from "react";
import styles from "../../styles/Components/RegisterUserModal.module.css";
import TextField from "../TextField";

export default function EditUserModal({ user, onClose, onSave }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (user) {
            // Inicializar solo los campos editables
            setFormData({
                direccion: user.direccion || "",
                email: user.email || "",
                telefono: user.telefono || "",
                genero: user.genero || "",
                iD_Cede: user.iD_Cede || 0,
                licencia: user.licencia || "",
                esActivo: user.esActivo || true,
            });
        }
    }, [user]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        // Construimos el payload EXACTO que espera el backend
        const payload = {
            id: user.id,
            iD_Cede: 1, // siempre 1
            nombre: user.nombre,
            apellidoPaterno: user.apellidoPaterno,
            apellidoMaterno: user.apellidoMaterno,
            edad: user.edad,
            fechaNacimiento: user.fechaNacimiento,
            direccion: formData.direccion || "",
            curp: user.curp,
            email: formData.email || "",
            matriculaProfesional: user.matriculaProfesional || "",
            telefono: formData.telefono || "",
            genero: formData.genero || "",
            fechaCreacion: user.fechaCreacion,
            fechaActualizacion: new Date().toISOString(),
            fechaContrato: user.fechaContrato,
            licencia: formData.licencia || "",
            esActivo: formData.esActivo !== undefined ? formData.esActivo : true,
        };

        console.log("🚀 Payload que se enviará al backend:", payload);

        onSave(user.id, payload);
        onClose();
    };



    return (
        <div className={styles.overlay}>
            <div className={`${styles.modal} ${styles.animateIn}`}>
                <h2>Editar Colaborador</h2>

                <div className={styles.fieldsGrid}>
                    {/* Campos no editables */}
                    <TextField label="CURP" value={user.curp} disabled />
                    <TextField label="Nombre" value={user.nombre} disabled />
                    <TextField label="Apellido Paterno" value={user.apellidoPaterno} disabled />
                    <TextField label="Apellido Materno" value={user.apellidoMaterno} disabled />
                    <TextField label="Edad" value={user.edad} disabled />
                    <TextField label="Fecha de Nacimiento" value={new Date(user.fechaNacimiento).toLocaleDateString()} disabled />

                    {/* Campos editables */}
                    <TextField label="Dirección" value={formData.direccion} onChange={e => handleChange("direccion", e.target.value)} />
                    <TextField label="Email" value={formData.email} onChange={e => handleChange("email", e.target.value)} />
                    <TextField label="Teléfono" value={formData.telefono} onChange={e => handleChange("telefono", e.target.value)} />
                    <TextField label="Género" value={formData.genero} onChange={e => handleChange("genero", e.target.value)} />
                    <TextField label="Sucursal (ID)" type="number" value={formData.iD_Cede} onChange={e => handleChange("iD_Cede", e.target.value)} />
                    <TextField label="Licencia" value={formData.licencia} onChange={e => handleChange("licencia", e.target.value)} />
                    <TextField label="Activo" type="checkbox" checked={formData.esActivo} onChange={e => handleChange("esActivo", e.target.checked)} />
                </div>

                <div className={styles.actions}>
                    <button className={styles.saveButton} onClick={handleSave}>Guardar</button>
                    <button className={styles.cancelButton} onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}
