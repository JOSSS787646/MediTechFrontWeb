import React from "react";
import styles from "../styles/Components/Navbar.module.css";
import { useNavigate } from "react-router-dom";

export default function Navbar({ username = "Usuario" }) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleHomeNurseClick = () => {
    navigate("/home-nurse");
  };

  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        <div className={styles.rightSection}>
          {/* Home */}
          <div className={styles.navItem} onClick={handleHomeNurseClick} style={{ cursor: "pointer" }}>
            <span className="material-icons" style={{ color: "#4B908E" }}>home</span>
            <span>Home Nurse</span>
          </div>

          {/* Historial Clínico */}
          <div className={styles.navItem}>
            <span className="material-icons" style={{ color: "#4B908E" }}>history</span>
            <span>Historial Clínico</span>
          </div>

          {/* Nombre de usuario (clic para perfil) */}
          <div
            className={styles.userName}
            onClick={handleProfileClick}
            style={{ cursor: "pointer" }}
          >
            {username}
          </div>
        </div>
      </nav>

      {/* Línea inferior solo debajo del navbar */}
      <div className={styles.navline}></div>
    </div>
  );
}
