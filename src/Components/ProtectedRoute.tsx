
import { useAuth } from "../hook/useAuth";
import { Navigate } from "react-router-dom";


//METOD QUE VALIDA QUE MIS RUTAS ESTEN PROTEGIDAS Y EXISTA UN TOKEN


export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isCheckingAuth } = useAuth();

  // ⏳ Espera mientras valida el token
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // 🔒 Si no hay sesión, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Si hay sesión, renderiza el contenido
  return children;
}
