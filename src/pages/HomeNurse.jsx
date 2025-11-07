import React from "react";
import styles from "../styles/pages/HomeNurse.module.css";
import Navbar from "../Components/Navbar";
import 'material-icons/iconfont/material-icons.css';

export default function HomeNurse() {
  return (
    <div className={styles.container}>
      {/* Logo independiente a la izquierda */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo" className={styles.logo} />
      </div>
        
      {/* Navbar a la derecha
      --------Este es un componente Nav, solo hay que mandarlo llamar-----
      */}
      <Navbar username="José Martínez" />
    </div>

    
  );
}
