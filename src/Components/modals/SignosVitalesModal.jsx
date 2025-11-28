// SignosVitalesModal.jsx
import React, { useState, useEffect } from "react";
import styles from "../../styles/Components/SignosVitalesModal.module.css";
import { createSignosVitales } from "../../Api/signosVitales";
import { getPacienteByCurp } from "../../Api/paciente";
import Swal from "sweetalert2";

export default function SignosVitalesModal({ paciente, onClose, onSave }) {
  const [pacienteId, setPacienteId] = useState(null);

  const [formData, setFormData] = useState({
    Temperatura: "",
    Presion: "",
    Estatura: "",
    Alergias: "",
  });

  // Obtener ID del paciente
  useEffect(() => {
    const cargarPaciente = async () => {
      try {
        const p = await getPacienteByCurp(paciente.curp);
        setPacienteId(p.id);
      } catch {
        Swal.fire("Error", "No se pudo obtener el ID del paciente.", "error");
      }
    };

    if (paciente?.curp) cargarPaciente();
  }, [paciente]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Guardar signos vitales
  const handleGuardar = async () => {
    if (!pacienteId)
      return Swal.fire("Error", "ID del paciente no encontrado.", "error");

    if (!paciente?.idColaborador)
      return Swal.fire("Error", "ID del colaborador no encontrado.", "error");

    const dto = {
      temperatura: Number(formData.Temperatura),
      presion: Number(formData.Presion),
      estatura: Number(formData.Estatura),
      alergias: formData.Alergias,
      fechaRegistro: new Date().toISOString(),
      id_Colaborador: paciente.idColaborador,
      id_Paciente: pacienteId,
    };

    try {
      await createSignosVitales(dto);

      await Swal.fire({
        icon: "success",
        title: "Signos vitales registrados",
        text: "Los signos vitales se guardaron correctamente.",
        timer: 1800,
        showConfirmButton: false,
        zIndex: 2000,
      });

      onSave?.();
      onClose?.();

    } catch {
      Swal.fire("Error", "No se pudieron guardar los signos vitales.", "error");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* TÍTULO CENTRADO */}
        <div className={styles.titleCenter}>
          <h2>Agregar signos a:</h2>
          <h3 className={styles.patientName}>{paciente?.nombreCompleto}</h3>
        </div>

        {/* FORM */}
        <div className={styles.formGrid}>

          {/* TEMPERATURA */}
          <div className={styles.field}>
            <label>
              <span className="material-icons-outlined">device_thermostat</span>
              Temperatura (°C)
            </label>
            <input name="Temperatura" type="number" onChange={handleChange} />
          </div>

          {/* PRESIÓN */}
          <div className={styles.field}>
            <label>
              <span className="material-icons-outlined">favorite</span>
              Presión (mmHg)
            </label>
            <input name="Presion" type="number" onChange={handleChange} />
          </div>

          {/* ESTATURA */}
          <div className={styles.field}>
            <label>
              <span className="material-icons-outlined">accessibility</span>
              Estatura (m)
            </label>
            <input name="Estatura" type="number" step="0.01" onChange={handleChange} />
          </div>

          {/* ALERGIAS */}
          <div className={styles.fieldFull}>
            <label>
              <span className="material-icons-outlined">warning</span>
              Alergias
            </label>
            <textarea name="Alergias" rows={3} onChange={handleChange} />
          </div>

        </div>

        {/* BOTONES */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.saveBtn} onClick={handleGuardar}>
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}
