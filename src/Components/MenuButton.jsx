import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Components/MenuButton.module.css";

export default function MenuButton({ text, icon, color = "#4B908E", route = null, isActive = false, onClick, abierto = true }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (route) navigate(route);
    if (onClick) onClick();
  };

  return (
    <div
      className={`${styles.menuButton} ${isActive ? styles.active : ""}`}
      style={isActive ? { backgroundColor: color } : {}}
      onClick={handleClick}
    >
      {/* Ícono Material */}
      <span className="material-icons">{icon}</span>

      {/* Texto, que se oculta cuando sidebar está cerrado */}
      <span className={`${styles.text} ${abierto ? styles.mostrar : styles.ocultar}`}>
        {text}
      </span>
    </div>
  );
}
