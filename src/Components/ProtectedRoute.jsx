import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, rolesPermitidos }) {
  const user = JSON.parse(localStorage.getItem("usuario"));
  const tipo = user?.TipoColaborador;

  if (!user) return <Navigate to="/login" />;
  if (rolesPermitidos && !rolesPermitidos.includes(tipo))
    return <Navigate to="/login" />;

  return children;
}
