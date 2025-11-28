import React, { useState, useEffect } from "react";
import SidebarMenu from "../../Components/SidebarMenu";
import styles from "../../styles/pages/DoctorCitasView.module.css"; // 👈 MISMO DISEÑO
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
      {/* === SIDEBAR === */}
      <SidebarMenu opcionesCustom={SidebarNurse} passObject={true} />

      <div className={styles.contentArea}>
        <div className={styles.container}>

          {/* ===== HEADER PRINCIPAL — FIJO ===== */}
          <header className={styles.header}>
            <div className={styles.logoBox}>
              <img src={logo} alt="Logo" className={styles.logo} />
            </div>

            <div className={styles.userInfo}>
              <div className={styles.userName}>
                <span className="material-icons">account_circle</span>
                {usuario?.nombreUsuario || "Enfermera"}
              </div>
            </div>
          </header>

          {/* ===== ENCABEZADO DE SECCIÓN — FIJO ===== */}
          <section className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <span className="material-icons">event_note</span>
              Registrar Nueva Cita
            </div>

            <div className={styles.appointmentCount}>
              <span className="material-icons">add</span>
              Nueva Cita
            </div>
          </section>

          {/* ===== FORMULARIO EN CONTENEDOR SCROLL ===== */}
          <div className={styles.scrollContainer}>
            <div className={styles.formContent}>

              {/* ===================== BUSCAR PACIENTE ===================== */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionSubtitle}>
                  <span className="material-icons">fingerprint</span>
                  Buscar Paciente
                </h3>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroupFull}>
                    <label>
                      <span className="material-icons">badge</span>
                      CURP del paciente
                    </label>

                    <input
                      type="text"
                      name="curp"
                      placeholder="Ingresa CURP del paciente"
                      value={formData.curp}
                      onChange={handleChange}
                      className={styles.formInput}
                      maxLength="18"
                      style={{ textTransform: "uppercase" }}
                    />
                  </div>
                </div>
              </div>

              {/* ===================== INFORMACIÓN DE LA CITA ===================== */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionSubtitle}>
                  <span className="material-icons">medical_services</span>
                  Información de la Cita
                </h3>

                <div className={styles.formGrid}>

                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">local_hospital</span>
                      Especialidad
                    </label>
                    <select
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      className={styles.formSelect}
                    >
                      <option value="">Seleccione</option>
                      <option>Cardiología</option>
                      <option>Medicina General</option>
                      <option>Ginecología</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">person</span>
                      Médico
                    </label>
                    <select
                      name="medico"
                      value={formData.medico}
                      onChange={handleChange}
                      className={styles.formSelect}
                    >
                      <option value="">Seleccione</option>
                      <option>Dr. Juan Pérez</option>
                      <option>Dra. Sonia García</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">location_on</span>
                      Sede
                    </label>
                    <select
                      name="sede"
                      value={formData.sede}
                      onChange={handleChange}
                      className={styles.formSelect}
                    >
                      <option value="">Seleccione</option>
                      <option>Unidad Norte</option>
                      <option>Unidad Sur</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>
                      <span className="material-icons">calendar_today</span>
                      Fecha de Cita
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.inputGroupFull}>
                    <label>
                      <span className="material-icons">access_time</span>
                      Hora
                    </label>
                    <select
                      name="hora"
                      value={formData.hora}
                      onChange={handleChange}
                      className={styles.formSelect}
                    >
                      <option value="">Seleccione</option>
                      <option>08:00</option>
                      <option>09:00</option>
                      <option>10:00</option>
                    </select>
                  </div>

                  <div className={styles.inputGroupFull}>
                    <label>
                      <span className="material-icons">notes</span>
                      Motivo
                    </label>
                    <textarea
                      name="motivo"
                      rows="4"
                      placeholder="Motivo de consulta"
                      value={formData.motivo}
                      onChange={handleChange}
                      className={styles.formTextarea}
                    ></textarea>
                  </div>

                </div>

                {/* ======= BOTÓN GUARDAR ======= */}
                <div className={styles.formActions}>
                  <button className={styles.saveButton} type="button">
                    <span className="material-icons">check_circle</span>
                    Registrar Cita
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
