import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import HomeNurse from "./pages/HomeNurse";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/*  Ruta inicial */}
        <Route path="/" element={<Splash />} />

        {/*  Ruta de login */}
        <Route path="/login" element={<Login />} />

        {/*  Ruta de home nurse */}
        <Route path="/home-nurse" element={<HomeNurse />} />

      </Routes>
    </BrowserRouter>
  );
}
