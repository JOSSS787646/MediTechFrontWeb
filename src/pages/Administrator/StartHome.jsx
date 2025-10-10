import React from "react";
import banner from "../../assets/logo.png";
import styles from "../../styles/pages/StartHome.module.css";

export default function StartHome() {
  return (
    <div className={styles.startHomeContainer}>
      <img src={banner} alt="Banner" className={styles.bannerImage} />
    </div>
  );
}
