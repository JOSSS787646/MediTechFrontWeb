// pages/HomeDoctor.jsx
import React, { useEffect, useState } from "react";
import SidebarMenu from "../Components/SidebarMenu";
import styles from "../styles/pages/HomeAdministrador.module.css";
import DoctorHome from "./Administrator/DoctorHome";
import { SidebarDoctor } from "../Config/sidebars";

export default function HomeDoctor() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) setUsuario(JSON.parse(userData));
  }, []);

  return (
    <div className={styles.container}>
      <SidebarMenu opcionesCustom={SidebarDoctor} />

      <main className={styles.mainContent}>
        <DoctorHome usuario={usuario} />
      </main>
    </div>
  );
}
