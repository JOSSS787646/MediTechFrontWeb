import React from "react";
import styles from "../styles/Components/InfoCard.module.css";

export default function InfoCard({ title, data }) {
  // data es un array de objetos: { label: "Enfermera", value: "Toña Patricia..." }
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>{title}</div>
      <div className={styles.cardContent}>
        {data.map((item, index) => (
          <div key={index} className={styles.cardRow}>
            <div className={styles.cardLabel}>{item.label}</div>
            <div className={styles.cardValue}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
