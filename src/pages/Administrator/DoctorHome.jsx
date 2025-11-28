import React, { useState, useEffect } from "react";
import styles from "../../styles/pages/DoctorHome.module.css";
import logo from "../../assets/logoLargo.png";
import { useNavigate } from "react-router-dom";
import { getCitasDeColaborador } from "../../Api/colaborator";
import "material-icons/iconfont/material-icons.css";

const Iconos = {
  usuario: "account_circle",
  reloj: "schedule",
  calendario: "calendar_today",
  buscar: "search",
  citas: "today",
  evento: "event_available",
  paciente: "person",
  atender: "medical_services",
  edad: "cake",
  motivo: "description",
  doctor: "local_hospital",
  vacio: "event_busy",
  loading: "refresh"
};

export default function DoctorHome() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [horaActual, setHoraActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [idColaborador, setIdColaborador] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState("Doctor");
  const [loading, setLoading] = useState(false);
  const [loadingCitas, setLoadingCitas] = useState(true);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Cargar usuario al iniciar
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
      setIdColaborador(usuario.id);
      setNombreUsuario(usuario.nombreUsuario || "Doctor");
      console.log("✅ Usuario cargado:", usuario);
    }
  }, []);

  // Cargar citas cuando tengamos el ID del colaborador
  useEffect(() => {
    if (idColaborador) {
      console.log("🔄 Cargando citas para colaborador:", idColaborador);
      cargarCitas();
    }
  }, [idColaborador]);

  // Reloj en tiempo real
  useEffect(() => {
    const actualizarReloj = () => {
      const ahora = new Date();
      setHoraActual(ahora.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second:"2-digit"
      }));
      setFechaActual(ahora.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }));
    };

    actualizarReloj();
    const intervalo = setInterval(actualizarReloj, 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Función para cargar citas
  const cargarCitas = async () => {
    setLoadingCitas(true);
    try {
      console.log("📞 Llamando al endpoint de citas...");
      const respuesta = await getCitasDeColaborador(idColaborador);
      console.log("📋 Respuesta recibida:", respuesta);

      if (!Array.isArray(respuesta)) {
        console.error("❌ La respuesta no es un array");
        setLoadingCitas(false);
        return;
      }

      // Procesar cada cita
      const citasProcesadas = respuesta.map((cita, index) => {
        console.log(`📝 Procesando cita ${index}:`, cita);

        return {
          // Información de la cita
          id: cita.id || `cita-${index}`,
          fechaCita: cita.fechaCita,
          horaCita: cita.horaCita,
          motivo: cita.motivo,
          medico: cita.medico,
          
          // Información del paciente (DE LA CITA)
          pacienteNombre: cita.pacienteNombre || "Paciente",
          pacienteApellidoPaterno: cita.pacienteApellidoPaterno || "",
          pacienteApellidoMaterno: cita.pacienteApellidoMaterno || "",
          pacienteEdad: cita.edad || calcularEdad(cita.fechaNacimiento),
          pacienteCurp: cita.curp,
          pacienteTelefono: cita.telefono,
          pacienteFechaNacimiento: cita.fechaNacimiento,
          
          datosOriginales: cita
        };
      });

      console.log("✅ Citas procesadas:", citasProcesadas);
      setAppointments(citasProcesadas);
      setFilteredAppointments(citasProcesadas);

    } catch (error) {
      console.error("❌ Error cargando citas:", error);
    } finally {
      setLoadingCitas(false);
    }
  };

  // Calcular edad
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return "N/A";
    try {
      const nacimiento = new Date(fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      return edad;
    } catch  {
      return "N/A";
    }
  };

  // Buscar pacientes
  const handleSearch = (e) => {
    const valor = e.target.value;
    setSearch(valor);

    if (valor.trim() === "") {
      setFilteredAppointments(appointments);
    } else {
      const filtradas = appointments.filter(cita => {
        const nombreCompleto = `${cita.pacienteNombre} ${cita.pacienteApellidoPaterno} ${cita.pacienteApellidoMaterno}`.toLowerCase();
        return nombreCompleto.includes(valor.toLowerCase());
      });
      setFilteredAppointments(filtradas);
    }
    setCurrentPage(1); // Resetear a primera página al buscar
  };

  // Atender paciente - ENVIAR CURP
  const handleAtender = async (cita) => {
    setLoading(true);
    console.log("🩺 Atendiendo paciente:", cita);
    console.log("🔑 CURP a enviar:", cita.pacienteCurp);

    if (!cita.pacienteCurp) {
      alert("❌ Este paciente no tiene CURP registrado");
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate("/home-doctor/recetas", {
        state: {
          pacienteData: {
            curp: cita.pacienteCurp,
            nombre: `${cita.pacienteNombre} ${cita.pacienteApellidoPaterno} ${cita.pacienteApellidoMaterno}`,
            edad: cita.pacienteEdad,
            fechaNacimiento: cita.pacienteFechaNacimiento,
            telefono: cita.pacienteTelefono
          }
        }
      });
    } catch (error) {
      console.error("❌ Error al navegar:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos de paginación
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredAppointments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / rowsPerPage));

  return (
    <div className={styles.mainLayout}>
      <div className={styles.contentArea}>
        <div className={styles.container}>

          {/* HEADER */}
          <header className={styles.header}>
            <div className={styles.logoBox}>
              <img src={logo} alt="Logo" className={styles.logo} />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                <span className="material-icons">{Iconos.usuario}</span>
                {nombreUsuario}
              </span>
              <div className={styles.timeInfo}>
                <span className={styles.time}>
                  <span className="material-icons">{Iconos.reloj}</span>
                  {horaActual}
                </span>
                <span className={styles.date}>
                  <span className="material-icons">{Iconos.calendario}</span>
                  {fechaActual}
                </span>
              </div>
            </div>
          </header>

          {/* BARRA DE BÚSQUEDA */}
          <div className={styles.searchSection}>
            <div className={styles.searchBarWrapper}>
              <span className="material-icons">{Iconos.buscar}</span>
              <input
                type="text"
                placeholder="Buscar paciente por nombre..."
                value={search}
                onChange={handleSearch}
                className={styles.searchBar}
                disabled={loadingCitas}
              />
            </div>
          </div>

          {/* ENCABEZADO */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className="material-icons">{Iconos.citas}</span>
              Citas del Día
            </h2>
            <div className={styles.headerActions}>
              <span className={styles.appointmentCount}>
                <span className="material-icons">{Iconos.evento}</span>
                {loadingCitas ? (
                  <span className={styles.loadingText}>Cargando...</span>
                ) : (
                  `${filteredAppointments.length} ${filteredAppointments.length === 1 ? 'cita' : 'citas'}`
                )}
              </span>
            </div>
          </div>

          {/* TABLA DE CITAS CON SPINNER */}
          <div className={styles.scrollContainer}>
            <div className={styles.tableWrapper}>
              <div className={styles.tableContainer}>
                {loadingCitas ? (
                  // SPINNER DE CARGA
                  <div className={styles.loadingContainer}>
                    <div className={styles.spinner}>
                      <span className="material-icons">{Iconos.loading}</span>
                    </div>
                    <p className={styles.loadingText}>Cargando citas...</p>
                    <p className={styles.loadingSubtext}>Por favor espere</p>
                  </div>
                ) : (
                  // TABLA DE CITAS
                  <>
                    <table className={styles.citasTable}>
                      <thead>
                        <tr>
                          <th>Paciente</th>
                          <th>Edad</th>
                          <th>Fecha</th>
                          <th>Hora</th>
                          <th>Motivo</th>
                          <th>Doctor</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRows.length > 0 ? (
                          currentRows.map((cita, index) => (
                            <tr key={cita.id || index} className={styles.tableRow}>
                              <td className={styles.patientCell}>
                                <div className={styles.patientInfo}>
                                  <span className={styles.patientIcon}>
                                    <span className="material-icons">{Iconos.paciente}</span>
                                  </span>
                                  <div>
                                    <div className={styles.patientName}>
                                      {cita.pacienteNombre} {cita.pacienteApellidoPaterno} {cita.pacienteApellidoMaterno}
                                    </div>
                                    <div className={styles.curpText}>
                                      CURP: {cita.pacienteCurp || "No disponible"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className={styles.edadBadge}>
                                  {cita.pacienteEdad} años
                                </span>
                              </td>
                              <td>{cita.fechaCita ? new Date(cita.fechaCita).toLocaleDateString("es-MX") : "N/A"}</td>
                              <td>
                                <span className={styles.horaBadge}>
                                  {cita.horaCita || "N/A"}
                                </span>
                              </td>
                              <td className={styles.motivoCell}>
                                {cita.motivo || "Sin motivo"}
                              </td>
                              <td>{cita.medico || "No asignado"}</td>
                              <td>
                                <button
                                  className={`${styles.btnAtender} ${loading ? styles.btnLoading : ''}`}
                                  onClick={() => handleAtender(cita)}
                                  disabled={!cita.pacienteCurp || loading}
                                >
                                  {loading ? (
                                    <>
                                      <span className="material-icons spinning">{Iconos.loading}</span>
                                      Cargando...
                                    </>
                                  ) : (
                                    <>
                                      <span className="material-icons">{Iconos.atender}</span>
                                      Atender
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className={styles.emptyRow}>
                              <div className={styles.emptyState}>
                                <span className="material-icons">{Iconos.vacio}</span>
                                <p>No hay citas programadas</p>
                                <small>Las citas aparecerán aquí cuando estén agendadas</small>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* PAGINACIÓN */}
                    {filteredAppointments.length > 0 && (
                      <Paginacion
                        filteredData={filteredAppointments}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================================================================
   COMPONENTE DE PAGINACIÓN
================================================================ */
function Paginacion({
  filteredData,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  if (filteredData.length === 0) return null;

  return (
    <div className={styles.paginationTable}>
      <div className={styles.rowsSelectorTable}>
        <label>Filas por página:</label>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {[5, 10, 15, 20].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.pageControlsTable}>
        <button
          className={styles.paginationBtn}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          <span className="material-icons">chevron_left</span>
        </button>

        <span className={styles.pageInfoTable}>
          Página {currentPage} de {totalPages}
        </span>

        <button
          className={styles.paginationBtn}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
    </div>
  );
}