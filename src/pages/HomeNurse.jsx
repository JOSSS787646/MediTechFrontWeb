import { useNavigate } from "react-router-dom";

export default function HomeEnfermera() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenido</h1>
      <p className="text-gray-700 text-lg mb-6">Página en mantenimiento</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
