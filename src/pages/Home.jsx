import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../auth";

export default function Home() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold mb-2">Bienvenido{user?.nombre ? `, ${user.nombre}` : ""} 🎉</h1>
      <p className="text-gray-700 mb-6">Has iniciado sesión correctamente.</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
