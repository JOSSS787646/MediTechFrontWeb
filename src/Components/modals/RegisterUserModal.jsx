import React, { useState } from "react";
import styles from "../../styles/components/RegisterUserModal.module.css";
import TextField from "../TextField";

export default function RegisterUserModal({ onClose, onSave }) {
    const [nombre, setNombre] = useState("");
    const [apePaterno, setApePaterno] = useState("");
    const [apeMaterno, setApeMaterno] = useState("");
    const [edad, setEdad] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [direccion, setDireccion] = useState("");
    const [curp, setCurp] = useState("");
    const [email, setEmail] = useState("");
    const [matricula, setMatricula] = useState("");
    const [telefono, setTelefono] = useState("");
    const [genero, setGenero] = useState("");
    const [fechaContrato, setFechaContrato] = useState("");
    const [licencia, setLicencia] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
        if (!apePaterno.trim()) newErrors.apePaterno = "El apellido paterno es obligatorio";
        if (!apeMaterno.trim()) newErrors.apeMaterno = "El apellido materno es obligatorio";
        if (!edad.trim()) newErrors.edad = "La edad es obligatoria";
        else if (isNaN(edad) || edad <= 0) newErrors.edad = "Ingresa una edad válida";
        if (!diagnostico.trim()) newErrors.diagnostico = "El diagnóstico es obligatorio";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const usuario = {
            id: Date.now(),
            nombre,
            apePaterno,
            apeMaterno,
            edad,
            fechaNacimiento,
            direccion,
            curp,
            email,
            matricula,
            telefono,
            genero,
            fechaContrato,
            licencia,
            diagnostico
        };

        // Solo pasamos los datos al componente padre
        onSave(usuario);
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={`${styles.modal} ${styles.animateIn}`}>
                <h2 className={styles.title}>Registrar Usuario</h2>

                <div className={styles.fieldsGrid}>
                    <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ejemplo: Juan" error={errors.nombre} />
                    <TextField label="Apellido Paterno" value={apePaterno} onChange={(e) => setApePaterno(e.target.value)} placeholder="Ejemplo: Pérez" error={errors.apePaterno} />
                    <TextField label="Apellido Materno" value={apeMaterno} onChange={(e) => setApeMaterno(e.target.value)} placeholder="Ejemplo: Gómez" error={errors.apeMaterno} />
                    <TextField label="Edad" type="number" value={edad} onChange={(e) => setEdad(e.target.value)} placeholder="Ejemplo: 30" error={errors.edad} />
                    <TextField label="Fecha de Nacimiento" type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} error={errors.fechaNacimiento} />
                    <TextField label="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Ejemplo: Calle 123" error={errors.direccion} />
                    <TextField label="CURP" value={curp} onChange={(e) => setCurp(e.target.value)} placeholder="Ejemplo: ABCD123456HDF" error={errors.curp} />
                    <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ejemplo: correo@dominio.com" error={errors.email} />
                    <TextField label="Matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="Ejemplo: 12345" error={errors.matricula} />
                    <TextField label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Ejemplo: 5551234567" error={errors.telefono} />
                    <TextField label="Género" value={genero} onChange={(e) => setGenero(e.target.value)} placeholder="Ejemplo: Masculino/Femenino" error={errors.genero} />
                    <TextField label="Fecha de Contrato" type="date" value={fechaContrato} onChange={(e) => setFechaContrato(e.target.value)} error={errors.fechaContrato} />
                    <TextField label="Licencia" value={licencia} onChange={(e) => setLicencia(e.target.value)} placeholder="Ejemplo: A1234567" error={errors.licencia} />
                    <TextField label="Diagnóstico" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} placeholder="Ejemplo: Hipertensión" error={errors.diagnostico} />
                </div>

                <div className={styles.actions}>
                    <button className={styles.saveButton} onClick={handleSave}>Guardar</button>
                    <button className={styles.cancelButton} onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}
