// sidebars.js

// ========== ADMIN ==========  
export const SidebarAdmin = [
  { text: "Inicio", icon: "home", ruta: "/home-administrator" },
  { text: "Colaboradores", icon: "group", ruta: "/home-administrator/users" },
  { text: "Pacientes", icon: "personal_injury", ruta: "/home-pacientes" },
];

// ========== ENFERMERA ==========  
export const SidebarNurse = [
  { text: "Inicio", icon: "home", ruta: "/home-nurse" },
  { text: "Agendar Cita", icon: "event_available", ruta: "/home-nurse/citas" },
  { text: "Pacientes", icon: "personal_injury", ruta: "/home-pacientes" }
];



// ========== DOCTOR ==========  
export const SidebarDoctor = [
  { text: "Inicio", icon: "home", ruta: "/home-doctor" },
  //{ text: "Citas", icon: "event", ruta: "/home-doctor/citas" },  
  { text: "Pacientes", icon: "personal_injury", ruta: "/home-pacientes" },
  { text: "Recetas", icon: "receipt_long", ruta: "/home-doctor/recetas" },
];

