// AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import HomeAdministrador from "./pages/HomeAdministrator";
import HomeDoctor from "./pages/HomeDoctor";
import HomeNurse from "./pages/Administrator/NurseHome";
import PacientesHome from "./pages/Pacientes/pacientesHome";
import CitasView from "./pages/Nurse/CitasView";
import ProtectedRoute from "./Components/ProtectedRoute";
import DoctorCitasView from "./pages/Doctor/DoctorCitasView";
import DoctorRecetaView from "./pages/Doctor/DoctorRecetaView";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Página inicial */}
        <Route path="/" element={<Splash />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Panel del administrador */}
        <Route
          path="/home-administrator"
          element={
            <ProtectedRoute rolesPermitidos={["administrador", "admin", "3"]}>
              <HomeAdministrador />
            </ProtectedRoute>
          }
        />

        {/* Panel del médico */}
        <Route
          path="/home-doctor"
          element={
            <ProtectedRoute rolesPermitidos={["médico", "medico", "1", "administrador", "admin"]}>
              <HomeDoctor />
            </ProtectedRoute>
          }
        />

        {/* Panel de enfermería */}
        <Route
          path="/home-nurse"
          element={
            <ProtectedRoute rolesPermitidos={["enfermera", "2", "administrador", "admin"]}>
              <HomeNurse />
            </ProtectedRoute>
          }
        />

        {/* ✅ NUEVA VISTA DE CITAS PARA ENFERMERAS */}
        <Route
          path="/home-nurse/citas"
          element={
            <ProtectedRoute rolesPermitidos={["enfermera", "2", "administrador", "admin"]}>
              <CitasView />
            </ProtectedRoute>
          }
        />
        <Route
  path="/home-doctor/citas"
  element={
    <ProtectedRoute rolesPermitidos={["médico", "medico", "1", "administrador", "admin"]}>
      <DoctorCitasView />
    </ProtectedRoute>
  }
/>
<Route
  path="/home-doctor/recetas"
  element={
    <ProtectedRoute rolesPermitidos={["médico", "medico", "1", "administrador", "admin"]}>
      <DoctorRecetaView />
    </ProtectedRoute>
  }
/>



        {/* Vista de pacientes */}
        <Route
          path="/home-pacientes"
          element={
            <ProtectedRoute rolesPermitidos={["administrador", "admin", "3", "enfermera", "2", "medico", "1"]}>
              <PacientesHome />
            </ProtectedRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Splash />} />
      </Routes>
    </BrowserRouter>
  );
}
