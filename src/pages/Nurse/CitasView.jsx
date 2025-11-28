import React, { useState, useEffect } from "react";
import SidebarMenu from "../../Components/SidebarMenu";
import styles from "../../styles/pages/CitasView.module.css"; // 👈 MISMO CSS
import logo from "../../assets/logoLargo.png";
import { SidebarNurse } from "../../Config/sidebars";

export default function CitasView() {
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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className={styles.mainLayout}>
      <SidebarMenu opcionesCustom={SidebarNurse} passObject={true} />

      <main className={styles.contentArea}>
        <div className={styles.container}>

          {/* HEADER */}
          <header className={styles.header}>
            <img src={logo} alt="Logo" className={styles.logo} />

            <div className={styles.userBox}>
              <span className="material-icons">account_circle</span>
              {usuario?.nombreUsuario || "Enfermera"}
            </div>
          </header>

          <div className={styles.titleSection}>
            <span className="material-icons" style={{ fontSize: "2.5rem", color: "var(--sidebar-color)" }}>
              event_note
            </span>
            <h2 className={styles.title}>Registrar nueva cita</h2>
          </div>

          {/* FORMULARIO */}
          <form className={styles.fullForm}>

            {/* CURP */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <span className="material-icons">fingerprint</span>
                Buscar paciente
              </h3>

              <div className={styles.inputGroupFull}>
                <label>CURP del paciente</label>
                <input
                  type="text"
                  name="curp"
                  placeholder="Ingresa CURP del paciente"
                  value={formData.curp}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* DATOS DE CITA */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <span className="material-icons">medical_services</span>
                Información de la cita
              </h3>

              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label>Especialidad</label>
                  <select name="especialidad" value={formData.especialidad} onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option>Cardiología</option>
                    <option>Medicina General</option>
                    <option>Ginecología</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Médico</label>
                  <select name="medico" value={formData.medico} onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option>Dr. Juan Pérez</option>
                    <option>Dra. Sonia García</option>
                  </select>
                </div>
              </div>

              <div className={styles.twoCols}>
                <div className={styles.inputGroup}>
                  <label>Sede</label>
                  <select name="sede" value={formData.sede} onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option>Unidad Norte</option>
                    <option>Unidad Sur</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Fecha de cita</label>
                  <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
                </div>
              </div>

              <div className={styles.inputGroupFull}>
                <label>Hora</label>
                <select name="hora" value={formData.hora} onChange={handleChange}>
                  <option value="">Seleccione</option>
                  <option>08:00</option>
                  <option>09:00</option>
                  <option>10:00</option>
                </select>
              </div>

              <div className={styles.inputGroupFull}>
                <label>Motivo</label>
                <textarea
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  placeholder="Motivo de consulta"
                  rows="5"
                />
              </div>
            </div>
          </form>

          {/* BOTÓN FLOTANTE */}
          <button className={styles.fixedSaveBtn}>
            <span className="material-icons">check_circle</span>
            Registrar cita
          </button>
        </div>
      </main>
    </div>
  );
}
