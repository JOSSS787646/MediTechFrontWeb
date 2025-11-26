// Components/SidebarMenu.jsx
import { useNavigate, useLocation } from "react-router-dom";
import MenuButton from "./MenuButton";
import styles from "../styles/Components/SidebarMenu.module.css";
import logo from "../assets/logoimg.png";
import logoGrande from "../assets/logo.png";
import React, { useState, useEffect, useMemo } from "react";

/*
  🔹 Sidebar universal
  🔹 Usa opcionesCustom (SidebarAdmin / SidebarNurse / SidebarDoctor)
  🔹 Detecta la opción activa por ruta (la más específica)
*/

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

  // Opciones del menú:
  // - Si mandas opcionesCustom (SidebarAdmin/SidebarNurse/SidebarDoctor), se usan esas
  // - Si no mandas nada, se usa un sidebar "genérico" con rutas base
  const opciones = useMemo(() => {
    if (opcionesCustom && opcionesCustom.length > 0) return opcionesCustom;

    // Fallback genérico (por si algún Home no manda opcionesCustom)
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

    // Coincidencias de ruta con el pathname actual
    const coincidencias = opciones.filter(
      (o) =>
        o.ruta &&
        (
          location.pathname === o.ruta ||                 // ruta exacta
          location.pathname.startsWith(o.ruta + "/")      // subrutas (ej. /home-administrator/users/123)
        )
    );

    let opcionActiva = null;

    if (coincidencias.length > 0) {
      // Elegimos la ruta más larga = más específica
      opcionActiva = coincidencias.reduce((prev, curr) =>
        prev.ruta.length >= curr.ruta.length ? prev : curr
      );
    } else {
      // 🔁 Fallback:
      // 1. Sección que venga por prop
      // 2. "Inicio"
      // 3. Primera opción del arreglo
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
    // Feedback inmediato en el sidebar
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

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  // Abrir / cerrar sidebar haciendo click fuera de los botones
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
