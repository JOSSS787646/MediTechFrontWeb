
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth";
import styles from "../styles/Login.module.css";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginApi(username, password);
      console.log("🟢 Usuario autenticado:", response);

      if (response.exito && response.token) {
        const usuarioData = {
          id: response.id,              // 👈 GUARDAMOS EL ID
          nombreUsuario: username,
          tipoColaborador: response.tipoColaborador,
          token: response.token,
        };

        localStorage.setItem("usuario", JSON.stringify(usuarioData));
        console.log("👤 Usuario guardado en localStorage:", usuarioData);

        // Normalizamos el texto
        const tipo = response.tipoColaborador?.toString().trim().toLowerCase();
        console.log("🔎 Tipo de colaborador detectado:", tipo);

        if (
          tipo.includes("médico") ||
          tipo.includes("medico") ||
          tipo === "1"
        ) {
          navigate("/home-doctor");
        }
        else if (tipo.includes("enfermera") || tipo === "2") {
          navigate("/home-nurse");
        }
        else if (tipo.includes("admin") || tipo.includes("administrador") || tipo === "3") {
          navigate("/home-administrator");
        }
        else {
          console.warn("⚠️ Tipo de colaborador no reconocido:", tipo);
          navigate("/login");
        }

      } else {
        setTimeout(() => {
          setLoading(false);
          setShowModal(true);
        }, 800);
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      setTimeout(() => {
        setLoading(false);
        setShowModal(true);
      }, 800);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className={styles.container}>
      {/* Animated Background Elements */}
      <div className={styles.backgroundParticles}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Animated Lines */}
      <div className={styles.topLine} />
      <div className={styles.bottomLine} />

      <div className={styles.contentWrapper}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <img
              src="logo.png"
              alt="MediTech Logo"
              className={styles.logo}
            />
          </div>

          {/* Title */}
          <h1 className={styles.mainTitle}>
            Bienvenido
            <span className={styles.subtitle}>a MediTech</span>
          </h1>

          {/* Subtitle Badge */}
          <div className={styles.sloganWrapper}>
            <div className={styles.sloganBadge}>
              <p className={styles.sloganText}>
                Gestión médica más fácil, atención más humana
              </p>
            </div>
            <div className={styles.sloganUnderline} />
          </div>

          {/* Floating 3D Logo */}
          <div className={styles.floatingLogoContainer}>
            <div className={styles.floatingLogoInner}>
              {/* Glow Effect */}
              <div className={styles.glowEffect} />

              {/* 3D Rotating Logo */}
              <div className={styles.rotatingLogo}>
                <div className={styles.logoBackground} />
                <div className={styles.logoCard}>
                  <svg
                    className={styles.logoIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Orbiting Particles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={styles.orbitParticle}
                style={{
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Login Card */}
        <div className={styles.rightColumn}>
          <div className={styles.loginCard}>
            {/* Card Header */}
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Inicio de sesión</h2>
              <div className={styles.cardTitleUnderline} />
            </div>

            <div className={styles.formContainer}>
              {/* Username Input */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Usuario</label>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputIcon}>
                    <svg
                      className={
                        focusedInput === "username"
                          ? styles.iconActive
                          : styles.icon
                      }
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className={`${styles.input} ${focusedInput === "username" ? styles.inputFocused : ""
                      }`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedInput("username")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Ingresa tu usuario"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Contraseña</label>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputIcon}>
                    <svg
                      className={
                        focusedInput === "password"
                          ? styles.iconActive
                          : styles.icon
                      }
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    className={`${styles.input} ${focusedInput === "password" ? styles.inputFocused : ""
                      }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </div>
                <a href="#" className={styles.forgotPassword}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={styles.submitButton}
              >
                <span className={styles.buttonText}>
                  {loading ? "Validando..." : "Iniciar sesión"}
                </span>
                <div className={styles.buttonOverlay} />
              </button>
            </div>

            {/* Additional Options */}
            <div className={styles.additionalOptions}>
              <p className={styles.additionalText}>
                ¿Primera vez aquí?{" "}
                <a href="#" className={styles.additionalLink}>
                  Contacta al administrador
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinnerContainer}>
            <div className={styles.spinnerOuter} />
            <div className={styles.spinnerInner} />
            <div className={styles.spinnerCenter} />
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalIconContainer}>
                <svg
                  className={styles.modalIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className={styles.modalTitle}>MediTech informa</h3>
              <p className={styles.modalMessage}>
                Usuario o contraseña incorrectos
              </p>
              <button onClick={closeModal} className={styles.modalButton}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
