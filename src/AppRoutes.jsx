import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import HomeAdministrador from "./pages/HomeAdministrator";
import HomeDoctor from "./pages/Administrator/DoctorHome";
import HomeNurse from "./pages/HomeNurse";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Ruta inicial */}
        <Route path="/" element={<Splash />} />

        {/* 🔐 Ruta de login */}
        <Route path="/login" element={<Login />} />

        {/* 🏥 Paneles por tipo de colaborador */}
        <Route path="/home-administrator" element={<HomeAdministrador />} />
        <Route path="/home-doctor" element={<HomeDoctor />} />
        <Route path="/home-nurse" element={<HomeNurse />} />

        {/* 🧭 Ruta por defecto si no existe */}
        <Route path="*" element={<Splash />} />
      </Routes>
    </BrowserRouter>
  );
}
