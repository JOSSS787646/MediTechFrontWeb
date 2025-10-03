import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Splash.module.css";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <img src="/logo.png" alt="Logo" className={styles.logo} />
    </div>
  );
}
