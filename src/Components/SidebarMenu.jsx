import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuButton from "./MenuButton";
import styles from "../styles/Components/SidebarMenu.module.css";

export default function SidebarMenu({ setSeccion }) {
  const [abierto, setAbierto] = useState(false); // inicia cerrado
  const [activo, setActivo] = useState("Inicio");
  const navigate = useNavigate();

  const opciones = [
    { text: "Inicio", icon: "home" },
    { text: "Usuarios", icon: "group" },
  ];

  const handleClick = (opcion) => {
    setActivo(opcion.text);
    if (setSeccion) setSeccion(opcion.text); // renderiza contenido en main
  };

  const handleLogout = () => {
    navigate("/login"); // redirige a login
  };

  return (
    <aside
      className={`${styles.sidebar} ${abierto ? styles.sidebarAbierto : styles.sidebarCerrado}`}
      onMouseEnter={() => setAbierto(true)}
      onMouseLeave={() => setAbierto(false)}
    >
      {/* Encabezado */}
      <div className={`${styles.header} d-flex align-items-center mb-3`}>
        <h5 className={`${abierto ? styles.mostrar : styles.ocultar} ${styles.logo}`}>
          MediTech
        </h5>
      </div>

      {/* Opciones del menú */}
      <nav className="d-flex flex-column">
        {opciones.map((opcion) => (
          <MenuButton
            key={opcion.text}
            text={opcion.text}
            icon={opcion.icon}
            color="#4B908E"
            isActive={activo === opcion.text}
            onClick={() => handleClick(opcion)}
            abierto={abierto}
          />
        ))}
      </nav>

      {/* Pie / Cerrar sesión */}
      <div className={styles.pie}>
        <MenuButton
          text="Cerrar sesión"
          icon="logout"
          color="#FF4B4B"
          isActive={false}
          onClick={handleLogout}  // redirige a /login
          abierto={abierto}
        />
      </div>
    </aside>
  );
}
