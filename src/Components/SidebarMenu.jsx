// Components/SidebarMenu.jsx
import { useNavigate, useLocation } from "react-router-dom";
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

  const navigate = useNavigate();
  const location = useLocation();

  // ============================
  // OPCIONES
  // ============================
  const opciones = useMemo(() => {
    if (opcionesCustom && opcionesCustom.length > 0) return opcionesCustom;

    return [
      { text: "Inicio", icon: "home", ruta: "/home-administrator" },
      { text: "Usuarios", icon: "group", ruta: "/home-administrator/users" },
      { text: "Enfermera", icon: "vaccines", ruta: "/home-nurse" },
      { text: "Doctores", icon: "medical_services", ruta: "/home-doctor" },
    ];
  }, [opcionesCustom]);

  // ============================
  // DETECTAR OPCIÓN ACTIVA POR RUTA
  // ============================
  useEffect(() => {
    if (!opciones || opciones.length === 0) return;

    const coincidencias = opciones.filter(
      (o) =>
        o.ruta &&
        (location.pathname === o.ruta ||
          location.pathname.startsWith(o.ruta + "/"))
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

    if (activo !== opcionActiva.text) setActivo(opcionActiva.text);

    if (setSeccion) {
      passObject ? setSeccion(opcionActiva) : setSeccion(opcionActiva.text);
    }
  }, [location.pathname, opciones, seccionActiva, activo, setSeccion, passObject]);

  // ============================
  // CLICK EN OPCIÓN
  // ============================
  const handleClick = (opcion) => {
    setActivo(opcion.text);

    if (setSeccion) {
      passObject ? setSeccion(opcion) : setSeccion(opcion.text);
    }

    if (opcion.ruta && opcion.ruta !== location.pathname) {
      navigate(opcion.ruta);
    }
  };

  // ============================
  // LOGOUT
  // ============================
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  // Abrir / cerrar sidebar al hacer clic en fondo
  const handleSidebarClick = (e) => {
    const clickedButton = e.target.closest("button");
    if (!clickedButton) setAbierto((prev) => !prev);
  };

  return (
    <aside
      className={`${styles.sidebar} ${
        abierto ? styles.sidebarAbierto : styles.sidebarCerrado
      }`}
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
        {/* 🔴 SE ELIMINÓ EL BOTÓN DE MODO OSCURO */}

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
