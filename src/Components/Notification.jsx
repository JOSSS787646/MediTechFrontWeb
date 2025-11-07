import React, { useEffect } from "react";

export default function Alert({ type, message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000); // desaparece después de 4s
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "#28a745" : "#dc3545";

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: bgColor,
        color: "#fff",
        padding: "16px 24px",
        borderRadius: "12px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
        fontFamily: "Georgia, serif",
        fontSize: "16px",
        fontWeight: 500,
        minWidth: "280px",
        maxWidth: "320px",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
}
