import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../auth";
import Logo from "../assets/logo-ucc.svg";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const userData = getUser();
    if (!userData) {
      navigate("/");
    } else {
      setUser(userData);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header   className={`text-white shadow-md ${
        user.rol === 'ADMINISTRADOR' ? 'bg-black' : 'bg-[var(--main-color)]'
        }`}
      >
        <div className="mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={Logo} className="h-12 w-auto cursor-pointer" onClick={() => navigate("/home")} />
            <div className="text-left">
              <h2 className="text-xl font-bold">Responsabilidad Social Universitaria</h2>
              <p className="text-sm opacity-90">Universidad Católica de Cuyo</p>
              {user.rol === 'ADMINISTRADOR' && <p className="text-sm opacity-90">Administrador</p>}
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: showMenu ? 'var(--hoover-main-color)' : 'transparent' }}
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold">
                {user.nombre.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{user.nombre}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/perfil");
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mi Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto px-4 py-8 flex justify-center">
        <div className="max-w-6xl mx-auto">
          {/* Bienvenida */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--main-color)' }}>
              Configuración
            </h2>
            <p className="text-gray-600 text-lg">
              Selecciona una opción para comenzar a trabajar
            </p>
          </div>

          {/* Botonera */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Informes */}
            <button 
              onClick={() => navigate("/informes")}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all group"
            >
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors" 
                style={{ backgroundColor: 'var(--main-color)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hoover-main-color)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--main-color)'}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Informes</h3>
              <p className="text-gray-600">Editar informes existentes</p>
            </button>

            {/* Usuarios */}
            {user.permisos && user.permisos.includes("Agregar Usuarios") && (
              <button 
                onClick={() => navigate("/usuarios")}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all group"
              >
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors" 
                  style={{ backgroundColor: 'var(--main-color)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hoover-main-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--main-color)'}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Usuarios</h3>
                <p className="text-gray-600">Administrar usuarios del sistema</p>
              </button>
            )}
          </div>
          
          {/* Volver Inicio */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-3 rounded-lg bg-[var(--main-color)] text-white font-semibold transition-colors"
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hoover-main-color)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--main-color)'}
            >
              Volver al Inicio
            </button> 
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-600 border-t">
        <p className="text-sm">
          © 2025 Universidad Católica de Cuyo - Sistema de Responsabilidad Social Universitaria
        </p>
      </footer>
    </div>
  );
}