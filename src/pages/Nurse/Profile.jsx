import React, { useState } from "react";
import styles from "../../styles/pages/Profile.module.css";
import Navbar from "../../Components/Navbar";
import 'material-icons/iconfont/material-icons.css';
import InfoCard from "../../Components/InfoCard";
import EditProfileModal from "../../Components/modals/EditProfileModal"; // importa tu modal

export default function Profile() {
  const [modalOpen, setModalOpen] = useState(false);

  // Estado de usuario actualizado para separar nombre y apellidos
  const [userData, setUserData] = useState({
    nombre: "Toña Patricia",
    apellidoPaterno: "Leon",
    apellidoMaterno: "Montalvo",
    edad: "25",
    fechaNacimiento: "12/03/2000",
    curp: "1120JDHBHF8FJFL",
    genero: "No binario",
    direccion: "Av. Chapultepec N42",
    telefono: "5572902693",
    email: "Joseatona@gmail.com",
    matricula: "78JNSD8NDJSX",
    fechaContrato: "12-03-2020",
    licencia: "NJNNS485S",
  });

  const handleSave = (data) => {
    setUserData(data); // Actualiza los datos
  };

  return (
    <div>
      {/* Contenedor principal: logo + navbar */}
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Logo" className={styles.logo} />
        </div>
        <Navbar username={`${userData.nombre} ${userData.apellidoPaterno}`} />
      </div>

      {/* Submenú Perfil */}
      <div className={styles.submenu}>
        <div className={styles.submenuTitle}>Perfil</div>
        {/* Ahora abre el modal en lugar de ir a otra página */}
        <span
          className={styles.editText}
          onClick={() => setModalOpen(true)}
        >
          Editar Datos
        </span>
      </div>

      {/* Contenedor de cards */}
      <div className={styles.cardsContainer}>
        {/* Datos Personales */}
        <InfoCard
          title="Datos Personales"
          data={[
            { label: "Nombre", value: userData.nombre },
            { label: "Apellido Paterno", value: userData.apellidoPaterno },
            { label: "Apellido Materno", value: userData.apellidoMaterno },
            { label: "Edad", value: userData.edad },
            { label: "Fca. Nacimiento", value: userData.fechaNacimiento },
            { label: "CURP", value: userData.curp },
            { label: "Género", value: userData.genero },
          ]}
        />

        {/* Domicilio + Contacto */}
        <div className={styles.horizontalCards}>
          <InfoCard
            title="Domicilio"
            data={[{ label: "Dirección", value: userData.direccion }]}
          />
          <InfoCard
            title="Contacto"
            data={[
              { label: "Teléfono", value: userData.telefono },
              { label: "Email", value: userData.email },
            ]}
          />
        </div>

        {/* Datos Laborales */}
        <InfoCard
          title="Datos Laborales"
          data={[
            { label: "Matrícula Profesional", value: userData.matricula },
            { label: "Fecha de Contrato", value: userData.fechaContrato },
            { label: "Licencia", value: userData.licencia },
          ]}
        />
      </div>

      {/* Modal para editar los datos */}
      <EditProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        userData={userData}
        onSave={handleSave}
      />
    </div>
  );
}
