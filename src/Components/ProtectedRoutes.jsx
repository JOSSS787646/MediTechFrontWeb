// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const tipoColaborador = localStorage.getItem("tipoColaborador");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Si tiene roles permitidos definidos
  if (allowedRoles && !allowedRoles.includes(tipoColaborador)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
