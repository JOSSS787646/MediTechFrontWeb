// DoctorCitasView.jsx
import React, { useState, useEffect } from "react";
import SidebarMenu from "../../Components/SidebarMenu";
import styles from "../../styles/pages/DoctorCitasView.module.css";
import logo from "../../assets/logoLargo.png";
import { SidebarDoctor } from "../../Config/sidebars";

export default function DoctorCitasView() {
  const [usuario, setUsuario] = useState(null);

  const [formData, setFormData] = useState({
    curp: "",
    especialidad: "",
    medico: "",
    sede: "",
    fecha: "",
    hora: "",
    motivo: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Cita registrada:\n" + JSON.stringify(formData, null, 2));
  };

  return (
    <div className={styles.mainLayout}>
      <SidebarMenu opcionesCustom={SidebarDoctor} passObject={true} />

      <main className={styles.contentArea}>
        <div className={styles.container}>

          {/* HEADER */}
          <header className={styles.header}>
            <img src={logo} alt="Logo" className={styles.logo} />

            <div className={styles.userBox}>
              <span className="material-icons">account_circle</span>
              {usuario?.nombreUsuario || "Doctor"}
            </div>
          </header>

          <hr className={styles.divider} />

          {/* TITULO */}
          <h2 className={styles.title}>Registrar nueva cita</h2>

          {/* FORMULARIO ALINEADO IGUAL QUE CitasView */}
          <form className={styles.fullForm}>

            {/* CURP */}
            <div className={styles.inputGroupFull}>
              <label>CURP del paciente:</label>
              <input
                type="text"
                name="curp"
                placeholder="Ingresa CURP y presiona ENTER"
                value={formData.curp}
                onChange={handleChange}
              />
            </div>

            {/* ESPECIALIDAD / MÉDICO */}
            <div className={styles.twoCols}>
              <div>
                <label>Especialidad</label>
                <select
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option>Cardiología</option>
                  <option>Medicina General</option>
                  <option>Ginecología</option>
                </select>
              </div>

              <div>
                <label>Médico</label>
                <select
                  name="medico"
                  value={formData.medico}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option>Dr. Juan Pérez</option>
                  <option>Dra. Sonia García</option>
                </select>
              </div>
            </div>

            {/* SEDE / FECHA */}
            <div className={styles.twoCols}>
              <div>
                <label>Sede</label>
                <select
                  name="sede"
                  value={formData.sede}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option>Unidad Norte</option>
                  <option>Unidad Sur</option>
                </select>
              </div>

              <div>
                <label>Fecha de cita</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* HORA */}
            <div className={styles.inputGroupFull}>
              <label>Hora</label>
              <select
                name="hora"
                value={formData.hora}
                onChange={handleChange}
              >
                <option value="">Seleccione</option>
                <option>08:00</option>
                <option>09:00</option>
                <option>10:00</option>
                <option>11:00</option>
              </select>
            </div>

            {/* MOTIVO */}
            <div className={styles.inputGroupFull}>
              <label>Motivo de consulta:</label>
              <textarea
                name="motivo"
                placeholder="Describe brevemente el motivo..."
                value={formData.motivo}
                onChange={handleChange}
              ></textarea>
            </div>

          </form>

          {/* BOTÓN FIJO */}
          <button className={styles.fixedSaveBtn} onClick={handleSave}>
            Registrar cita
          </button>

        </div>
      </main>
    </div>
  );
}
