import { useNavigate } from "react-router-dom";

export default function HomeEnfermera() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 mb-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">👩‍⚕️ Home Enfermera</h1>
            <p className="text-gray-600">Panel principal de enfermería</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Contenido principal para enfermera */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta de pacientes asignados */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Pacientes Asignados</h3>
              <p className="text-gray-600">Hoy</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">8</p>
          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Ver lista
          </button>
        </div>

        {/* Tarjeta de signos vitales */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">❤️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Signos Vitales</h3>
              <p className="text-gray-600">Por registrar</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">5</p>
          <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
            Registrar
          </button>
        </div>

        {/* Tarjeta de medicamentos */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">💊</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Medicamentos</h3>
              <p className="text-gray-600">Próximos</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">12</p>
          <button className="mt-4 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors">
            Administrar
          </button>
        </div>

      </div>

      {/* Acciones rápidas */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
            📋 Triage
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200">
            🩺 Evaluación
          </button>
          <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">
            🚨 Urgencias
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200">
            📊 Reportes
          </button>
        </div>
      </div>
    </div>
  );
}