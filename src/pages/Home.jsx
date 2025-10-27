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
      // Si no hay sesión, redirigir al login
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
      <header style={{ backgroundColor: 'var(--main-color)' }} className="text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="Logo" className="h-12 w-auto" />
            <div className="text-left">
              <h1 className="text-xl font-bold">Responsabilidad Social Universitaria</h1>
              <p className="text-sm opacity-90">Universidad Católica de Cuyo</p>
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
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 bg-white text-gray-700 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tarjeta Bienvenida */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--main-color)' }}>
              ¡Bienvenido, {user.nombre}!
            </h2>
            <p className="text-gray-600">
              Has iniciado sesión exitosamente en el sistema de RSU
            </p>
          </div>

          {/* Tarjeta Info Usuario */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--main-color)' }}>
              Información del Usuario
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

              <div className="border-l-4 pl-4" style={{ borderColor: 'var(--main-color)' }}>
                <p className="text-sm text-gray-500 font-medium">Rol</p>
                <p className="text-lg font-semibold text-gray-800">{user.rol}</p>
              </div>

              <div className="border-l-4 pl-4" style={{ borderColor: 'var(--main-color)' }}>
                <p className="text-sm text-gray-500 font-medium">ID de Usuario</p>
                <p className="text-lg font-semibold text-gray-800">#{user.id}</p>
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

          {/* Tarjeta Ámbitos */}
          {user.ambitos && user.ambitos.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
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

          {/* Pestañas */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--main-color)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800">Proyectos</h4>
              <p className="text-sm text-gray-500 mt-1">Gestionar proyectos RSU</p>
            </button>

            <button className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--main-color)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800">Usuarios</h4>
              <p className="text-sm text-gray-500 mt-1">Administrar usuarios</p>
            </button>

            <button className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--main-color)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800">Reportes</h4>
              <p className="text-sm text-gray-500 mt-1">Ver estadísticas</p>
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