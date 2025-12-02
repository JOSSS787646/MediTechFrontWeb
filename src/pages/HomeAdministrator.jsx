// HomeAdministrador.jsx
import React, { useState, useEffect } from "react";
import SidebarMenu from "../Components/SidebarMenu";
import styles from "../styles/pages/HomeAdministrador.module.css";
import "material-icons/iconfont/material-icons.css";
import StartHome from "./Administrator/StartHome";
import UsersHome from "./Administrator/UsersHome";
import PacientesHome from "./Pacientes/pacientesHome";

export default function HomeAdministrador() {
  const [seccion, setSeccion] = useState("Inicio");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));
  }, []);

  // 👇 OPCIONES DEL ADMIN SIN DOCTORES NI ENFERMERA + PACIENTES
  const opcionesAdmin = [
    { text: "Inicio", icon: "home" },
    { text: "Usuarios", icon: "group" },
    { text: "Pacientes", icon: "diversity_3" }, // 👈 nuevo
  ];

  const renderContenido = () => {
    switch (seccion) {
      case "Usuarios":
        return <UsersHome />;

      case "Pacientes":
        return <PacientesHome />;

      case "Inicio":
      default:
        return <StartHome usuario={usuario} setSeccion={setSeccion} />;
    }
  };

  return (
    <div className={styles.container}>
      <SidebarMenu
        setSeccion={setSeccion}
        seccionActiva={seccion}
        opcionesCustom={opcionesAdmin}  
      />
      <main className={styles.mainContent}>{renderContenido()}</main>
    </div>
  );
}
