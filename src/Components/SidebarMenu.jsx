import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importa el hook de autenticación
import MenuButton from "./MenuButton";
import styles from "../styles/Components/SidebarMenu.module.css";
import logo from "../assets/logoimg.png";
import logoGrande from "../assets/logo.png";
import React, { useState, useEffect, useMemo } from "react";

export default function SidebarMenu({
  setSeccion,
  seccionActiva,
  opcionesCustom,
  passObject = false,
}) {
  const [abierto, setAbierto] = useState(true);
  const [activo, setActivo] = useState(seccionActiva || "Inicio");
  const [modoOscuro, setModoOscuro] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth(); // 🔥 Obtén la función logout del contexto

  // Opciones del menú:
  const opciones = useMemo(() => {
    if (opcionesCustom && opcionesCustom.length > 0) return opcionesCustom;

    // Fallback genérico
    return [
      { text: "Inicio", icon: "home", ruta: "/home-administrator" },
      { text: "Usuarios", icon: "group", ruta: "/home-administrator/users" },
      { text: "Enfermera", icon: "vaccines", ruta: "/home-nurse" },
      { text: "Doctores", icon: "medical_services", ruta: "/home-doctor" },
    ];
  }, [opcionesCustom]);

  // ============================
  // MODO OSCURO
  // ============================
  useEffect(() => {
    const modoGuardado = localStorage.getItem("modoOscuro") === "true";
    setModoOscuro(modoGuardado);
  }, []);

  useEffect(() => {
    document.body.className = modoOscuro ? "modo-oscuro" : "";
    localStorage.setItem("modoOscuro", modoOscuro);
  }, [modoOscuro]);

  // ============================
  // DETECTAR OPCIÓN ACTIVA POR RUTA
  // ============================
  useEffect(() => {
    if (!opciones || opciones.length === 0) return;

    const coincidencias = opciones.filter(
      (o) =>
        o.ruta &&
        (
          location.pathname === o.ruta ||
          location.pathname.startsWith(o.ruta + "/")
        )
    );

    let opcionActiva = null;

    if (coincidencias.length > 0) {
      opcionActiva = coincidencias.reduce((prev, curr) =>
        prev.ruta.length >= curr.ruta.length ? prev : curr
      );
    } else {
      opcionActiva =
        opciones.find((o) => o.text === seccionActiva) ||
        opciones.find((o) => o.text === "Inicio") ||
        opciones[0];
    }

    if (!opcionActiva) return;

    if (activo !== opcionActiva.text) {
      setActivo(opcionActiva.text);
    }

    if (setSeccion) {
      passObject ? setSeccion(opcionActiva) : setSeccion(opcionActiva.text);
    }
  }, [location.pathname, opciones, seccionActiva, setSeccion, passObject, activo]);

  // ============================
  // CLICK EN OPCIÓN
  // ============================
  const handleClick = (opcion) => {
    if (activo !== opcion.text) {
      setActivo(opcion.text);
    }

    if (setSeccion) {
      passObject ? setSeccion(opcion) : setSeccion(opcion.text);
    }

    if (opcion.ruta && opcion.ruta !== location.pathname) {
      navigate(opcion.ruta);
    }
  };

  // 🔥 CORREGIDO: Usar el logout del contexto
  const handleLogout = () => {
    console.log("🚪 Cerrando sesión...");
    logout(); // 🔥 Esto actualiza el estado global de autenticación
    navigate("/login", { replace: true });
  };

  const handleSidebarClick = (e) => {
    const clickedButton = e.target.closest("button");
    if (!clickedButton) setAbierto((prev) => !prev);
  };

  const toggleModo = (e) => {
    e.stopPropagation();
    setModoOscuro((prev) => !prev);
  };

  return (
    <aside
      className={`${styles.sidebar} ${
        abierto ? styles.sidebarAbierto : styles.sidebarCerrado
      } ${modoOscuro ? styles.modoOscuro : ""}`}
      onClick={handleSidebarClick}
    >
      {/* Logo */}
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          {abierto ? (
            <img src={logoGrande} alt="Logo MediTech" className={styles.logoGrande} />
          ) : (
            <img src={logo} alt="Logo MediTech" className={styles.logoImg} />
          )}
        </div>
      </div>

      {/* Menú */}
      <nav className={styles.nav}>
        {opciones.map((opcion) => (
          <div key={opcion.text} onClick={(e) => e.stopPropagation()}>
            <MenuButton
              text={opcion.text}
              icon={opcion.icon}
              color="#1e5e5c"
              isActive={activo === opcion.text}
              onClick={() => handleClick(opcion)}
              abierto={abierto}
            />
          </div>
        ))}
      </nav>

      {/* Pie */}
      <div className={styles.pie} onClick={(e) => e.stopPropagation()}>
        <button
          className={`${styles.modoButton} ${
            abierto ? styles.modoAbierto : styles.modoCerrado
          }`}
          onClick={toggleModo}
        >
          <span className="material-icons">
            {modoOscuro ? "dark_mode" : "light_mode"}
          </span>
          {abierto && (
            <span className={styles.modoText}>
              {modoOscuro ? "Modo oscuro" : "Modo claro"}
            </span>
          )}
        </button>

        <button
          className={`${styles.logoutButton} ${
            abierto ? styles.logoutAbierto : styles.logoutCerrado
          }`}
          onClick={handleLogout}
        >
          <span className="material-icons">logout</span>
          {abierto && <span className={styles.logoutText}>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}