import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuButton from "./MenuButton";
import styles from "../styles/Components/SidebarMenu.module.css";
import logo from "../assets/logoimg.png";
import logoGrande from "../assets/logo.png";

export default function SidebarMenu({ setSeccion }) {
  const [abierto, setAbierto] = useState(true);
  const [activo, setActivo] = useState("Inicio");
  const [modoOscuro, setModoOscuro] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const modoGuardado = localStorage.getItem("modoOscuro") === "true";
    setModoOscuro(modoGuardado);
  }, []);

  useEffect(() => {
    document.body.className = modoOscuro ? "modo-oscuro" : "";
    localStorage.setItem("modoOscuro", modoOscuro);
  }, [modoOscuro]);

  const opciones = [
    { text: "Inicio", icon: "home" },
    { text: "Usuarios", icon: "group" },
    { text: "Enfermera", icon: "vaccines" },
    { text: "Doctores", icon: "medical_services" },
  ];

  const handleClick = (opcion) => {
    setActivo(opcion.text);
    if (setSeccion) setSeccion(opcion.text);
  };

  const handleLogout = () => {
    navigate("/login");
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
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          {abierto ? (
            <img src={logoGrande} alt="Logo MediTech" className={styles.logoGrande} />
          ) : (
            <img src={logo} alt="Logo MediTech" className={styles.logoImg} />
          )}
        </div>
      </div>

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
