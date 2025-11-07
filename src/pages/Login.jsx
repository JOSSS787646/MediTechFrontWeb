import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Api/auth"; // ✅ tu API original
import styles from "../styles/Login.module.css";
import { useAuth } from "../hook/useAuth"; // ✅ usamos el contexto

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginContext } = useAuth(); // ✅ función login del contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(username, password);

      if (response.exito && response.token) {
        // ✅ Guardar token en el contexto (internamente se guarda en localStorage)
        loginContext(response.token);

        // ✅ Redirigir al dashboard (ajusta la ruta según tu rol)
        navigate("/home-Administrator");
      } else {
        setTimeout(() => {
          setLoading(false);
          setShowModal(true);
        }, 800);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setTimeout(() => {
        setLoading(false);
        setShowModal(true);
      }, 800);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className={`${styles.container} ${loading ? styles.blur : ""}`}>
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

      {/* Spinner de carga */}
      {loading && (
        <div className={styles.spinnerOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {/* Modal de error */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>MediTech informa</h3>
            <p className={styles.modalMessage}>
              Usuario o contraseña incorrectos
            </p>
            <button className={styles.modalButton} onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
