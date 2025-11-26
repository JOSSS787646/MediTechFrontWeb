import { Navigate } from "react-router-dom";

// 🔹 Función auxiliar para limpiar acentos y normalizar
function normalizarTexto(texto) {
  return texto
    ?.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .trim()
    .toLowerCase();
}

export default function ProtectedRoute({ children, rolesPermitidos = [] }) {
  const storedUser = localStorage.getItem("usuario");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // ❌ No hay usuario → Login
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // Normalizamos el tipo
  const tipo = normalizarTexto(user.tipoColaborador);

  // Normalizamos los roles permitidos
  const rolesNormalizados = rolesPermitidos.map(normalizarTexto);

  // 🔎 Coincidencia flexible
  const tienePermiso = rolesNormalizados.some((rol) => {
    // si coincide directamente o contiene una parte del rol
    return tipo === rol || tipo.includes(rol);
  });

  // ❌ Si no tiene permiso → Login
  if (!tienePermiso) {
    console.warn("Acceso denegado:", tipo, "no está en", rolesNormalizados);
    return <Navigate to="/login" replace />;
  }

  // ✅ Si pasa todo → renderiza
  return children;
}
