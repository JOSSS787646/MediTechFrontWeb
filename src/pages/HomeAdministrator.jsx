//homeadministrador
import React, { useState } from "react";
import SidebarMenu from "../Components/SidebarMenu";
import styles from "../styles/pages/HomeAdministrador.module.css";
import "material-icons/iconfont/material-icons.css";
import StartHome from "./Administrator/StartHome";
import UsersHome from "./Administrator/UsersHome";
import NurseHome from "./Administrator/NurseHome";
import DoctorHome from "./Administrator/DoctorHome"; // 👨‍⚕️ nuevo

export default function HomeAdministrador() {
  const [seccion, setSeccion] = useState("Inicio");

  const renderContenido = () => {
    switch (seccion) {
      case "Usuarios":
        return <UsersHome />;
      case "Enfermera":
        return <NurseHome />;
      case "Doctores":
        return <DoctorHome />; // nuevo
      case "Inicio":
      default:
        return <StartHome />;
    }
  };

  return (
    <div className={styles.container}>
      <SidebarMenu setSeccion={setSeccion} />
      <main className={styles.mainContent}>{renderContenido()}</main>
    </div>
  );
}
