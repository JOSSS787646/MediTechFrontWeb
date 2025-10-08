import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para mostrar modal
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "Axel Nadir" && password === "1234") {
      navigate("/home-nurse");
    } else {
      setShowModal(true); // Muestra el modal en vez de alert
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      {/* Línea superior */}
      <div className={styles.topLine}></div>

      {/* Columna izquierda */}
      <div className={styles.left}>
        <img src="/logo.png" alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Bienvenido</h1>
        <p className={styles.subtitle}>
          <span>Gestión médica más fácil, atención más humana</span>
        </p>
      </div>

      {/* Columna derecha */}
      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Inicio de sesión</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Usuario</label>
              <input
                type="text"
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contraseña</label>
              <input
                type="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
              />
              <a href="#" className={styles.forgot}>
                Olvidé contraseña
              </a>
            </div>
            <button type="submit" className={styles.button}>
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>

      {/* Línea inferior */}
      <div className={styles.bottomLine}></div>

      {/* Modal personalizado */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>MediTech informa</h3>
            <p className={styles.modalMessage}>Usuario o contraseña incorrectos</p>
            <button className={styles.modalButton} onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
