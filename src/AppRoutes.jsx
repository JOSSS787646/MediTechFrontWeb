import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import HomeAdministrador from "./pages/HomeAdministrator";
import HomeNurse from "./pages/HomeNurse";
import DoctorHome from "./pages/Administrator/DoctorHome";
import DoctorPrescription from "./pages/Administrator/DoctorPrescription";
import Profile from "./pages/Nurse/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />

          {/*  Rutas protegidas */}
          <Route
            path="/home-administrator"
            element={
              <ProtectedRoute>
                <HomeAdministrador />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home-nurse"
            element={
              <ProtectedRoute>
                <HomeNurse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor"
            element={
              <ProtectedRoute>
                <DoctorHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/prescription"
            element={
              <ProtectedRoute>
                <DoctorPrescription />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 🚪 Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
