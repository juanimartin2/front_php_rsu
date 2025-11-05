import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../auth";
import Logo from "../assets/logo-ucc.svg";

export default function PerfilUsuario() {
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
      {/* Header */}
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

      {/* Main Content */}
      <main className="mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center justify-between gap-2 text-sm">
            <div className="text-gray-600 space-x-2 px-8">
              <span className="text-gray-600 hover:text-gray-900">Inicio</span>
              <span>/</span>
              <span className="font-medium text-[var(--main-color)]" >Usuarios</span>
            </div>
            <div className="px-4 space-x-4">
              <button onClick={() => navigate("/home")} className="bg-[var(--main-color)] text-white hover:bg-[var(--hoover-main-color)]">Volver a Inicio</button>
            </div>
          </div>

          {/* Welcome Card */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold" style={{ backgroundColor: 'var(--main-color)' }}>
                {user.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-3xl font-bold" style={{ color: 'var(--main-color)' }}>
                  {user.nombre}
                </h2>
                <p className="text-gray-600 text-lg">{user.rol}</p>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--main-color)' }}>
              Información Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 pl-4" style={{ borderColor: 'var(--main-color)' }}>
                <p className="text-sm text-gray-500 font-medium">Nombre Completo</p>
                <p className="text-lg font-semibold text-gray-800">{user.nombre}</p>
              </div>

              <div className="border-l-4 pl-4" style={{ borderColor: 'var(--main-color)' }}>
                <p className="text-sm text-gray-500 font-medium">CUIT</p>
                <p className="text-lg font-semibold text-gray-800">{user.cuit}</p>
              </div>
            </div>
          </div>

          {/* Permissions Card */}
          {user.permisos && user.permisos.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--main-color)' }}>
                Permisos del Rol
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.permisos.map((permiso, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg"
                    style={{ backgroundColor: '#f0f9f5' }}
                  >
                    <svg 
                      className="w-5 h-5 flex-shrink-0" 
                      style={{ color: 'var(--main-color)' }}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 font-medium">{permiso}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ambitos Card */}
          {user.ambitos && user.ambitos.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 flex align-middles flex-col items-center">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--main-color)' }}>
                Ámbitos Asignados
              </h3>
              <div className="flex flex-wrap gap-3">
                {user.ambitos.map((ambito) => (
                  <div
                    key={ambito.id}
                    className="px-4 py-2 rounded-full text-white font-medium"
                    style={{ backgroundColor: 'var(--main-color)' }}
                  >
                    {ambito.nombre}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-3 rounded-lg text-white font-semibold transition-colors"
              style={{ 
                backgroundColor: 'var(--main-color)',
              }}
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