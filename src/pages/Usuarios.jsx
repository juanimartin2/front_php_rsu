import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../auth";
import { getUsuarios, getRoles, getAmbitos, register, updateUsuario, deleteUsuario } from "../services/api";
import Logo from "../assets/logo-ucc.svg";

export default function Usuarios() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [ambitos, setAmbitos] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: "",
    cuit: "",
    password: "",
    rol: "",
    ambitos: [],
    activo: true
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const userData = getUser();
    if (!userData) {
      navigate("/");
    } else if (userData.rol !== "ADMINISTRADOR") {
      navigate("/home");
    } else {
      setUser(userData);
      cargarDatos();
    }
  }, [navigate]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [usuariosRes, rolesRes, ambitosRes] = await Promise.all([
        getUsuarios(),
        getRoles(),
        getAmbitos()
      ]);

      if (usuariosRes && !usuariosRes.error) {
        setUsuarios(usuariosRes);
      }
      if (rolesRes && !rolesRes.error) {
        setRoles(rolesRes);
      }
      if (ambitosRes && !ambitosRes.error) {
        setAmbitos(ambitosRes);
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const openModal = (mode, usuario = null) => {
    setModalMode(mode);
    setSelectedUser(usuario);
    setError("");
    setSuccess("");
    
    if (mode === "create") {
      setFormData({
        nombre: "",
        cuit: "",
        password: "",
        rol: "",
        ambitos: [],
        activo: true
      });
    } else if (mode === "edit" || mode === "view") {
      setFormData({
        nombre: usuario.nom_usu || "",
        cuit: usuario.cuit_usu || "",
        password: "",
        rol: usuario.rol_id || "",
        ambitos: usuario.ambitos_ids || [],
        activo: usuario.activo || true
      });
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setError("");
    setSuccess("");
  };

  const handleCuitChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    let formatted = value;
    if (value.length >= 2) {
      formatted = value.slice(0, 2) + '-' + value.slice(2);
    }
    if (value.length >= 10) {
      formatted = formatted.slice(0, 11) + '-' + formatted.slice(11);
    }
    
    setFormData(prev => ({ ...prev, cuit: formatted }));
  };

  const handleAmbitoChange = (ambitoId) => {
    setFormData(prev => {
      const ambitos = prev.ambitos.includes(ambitoId)
        ? prev.ambitos.filter(id => id !== ambitoId)
        : [...prev.ambitos, ambitoId];
      return { ...prev, ambitos };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nombre || !formData.cuit || !formData.rol) {
      setError("Nombre, CUIT y rol son obligatorios");
      return;
    }

    if (modalMode === "create" && !formData.password) {
      setError("La contraseña es obligatoria");
      return;
    }

    if (formData.password && formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (formData.ambitos.length === 0) {
      setError("Debe seleccionar al menos un ámbito");
      return;
    }

    if (modalMode === "edit") {
        const res = await updateUsuario(
            selectedUser.id,
            formData.nombre,
            formData.cuit,
            formData.password, // Vacío = no cambiar
            parseInt(formData.rol),
            formData.ambitos
        );

        if (res && res.success) {
            setSuccess("Usuario actualizado exitosamente");
            await cargarDatos();
            setTimeout(() => closeModal(), 1500);
        } else {
            setError(res.error || "Error al actualizar usuario");
        }
    }

    try {
      if (modalMode === "create") {
        const res = await register(
          formData.nombre,
          formData.cuit,
          formData.password,
          parseInt(formData.rol),
          formData.ambitos
        );

        if (res && res.success) {
          setSuccess("Usuario creado exitosamente");
          await cargarDatos();
          setTimeout(() => closeModal(), 1500);
        } else {
          setError(res.error || "Error al crear usuario");
        }
      } else if (modalMode === "edit") {
        setError("Función de edición en desarrollo");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error al procesar la solicitud");
    }
  };

  const handleDelete = async (usuarioId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
    const res = await deleteUsuario(usuarioId);
    
    if (res && res.success) {
      setSuccess("Usuario eliminado exitosamente");
      await cargarDatos();
    } else {
      setError(res.error || "Error al eliminar usuario");
    }
  }
  };

  if (!user || loading) {
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
                  onClick={() => navigate("/perfil")}
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
      <main className="mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center justify-between gap-2 text-sm">
            <div className="text-gray-600 space-x-2 px-8">
              <span className="text-gray-600 hover:text-gray-900">Configuración</span>
              <span>/</span>
              <span className="font-medium text-[var(--main-color)]" >Usuarios</span>
            </div>
            <div className="px-4 space-x-4">
              <button onClick={() => navigate("/config")} className="text-white bg-black hover:bg-gray-800">Volver a Configuración</button>
              <button onClick={() => navigate("/home")} className="bg-[var(--main-color)] text-white hover:bg-[var(--hoover-main-color)]">Inicio</button>
            </div>
          </div>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--main-color)' }}>
                Gestión de Usuarios
              </h2>
              <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
            </div>
            <button
              onClick={() => openModal("create")}
              className="bg-[var(--main-color)] text-white flex mt-4 gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Usuario
            </button>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* Tabla de Usuarios */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: 'var(--main-color)' }} className="text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">CUIT</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Rol</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usuarios.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No hay usuarios registrados
                      </td>
                    </tr>
                  ) : (
                    usuarios.map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">#{usuario.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{usuario.nom_usu}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{usuario.cuit_usu}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--main-color)', color: 'white' }}>
                            {usuario.rol}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {usuario.activo ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Activo
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Inactivo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openModal("view", usuario)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => openModal("edit", usuario)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              style={{ color: 'var(--main-color)' }}
                              title="Editar"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(usuario.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--main-color)' }}>
                {modalMode === "create" && "Nuevo Usuario"}
                {modalMode === "edit" && "Editar Usuario"}
                {modalMode === "view" && "Detalles del Usuario"}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    disabled={modalMode === "view"}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">CUIT *</label>
                  <input
                    type="text"
                    value={formData.cuit}
                    onChange={handleCuitChange}
                    disabled={modalMode === "view"}
                    maxLength={13}
                    placeholder="20-12345678-9"
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {modalMode !== "view" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Contraseña {modalMode === "create" ? "*" : "(dejar vacío para no cambiar)"}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Rol *</label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData(prev => ({ ...prev, rol: e.target.value }))}
                    disabled={modalMode === "view"}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Seleccione un rol --</option>
                    {roles.map(rol => (
                      <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                    ))}
                  </select>
                </div>

                <fieldset className="border-2 border-gray-300 rounded-lg p-4">
                  <legend className="text-sm font-medium px-2" style={{ color: 'var(--main-color)' }}>
                    Ámbitos *
                  </legend>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {ambitos.map(ambito => (
                      <div key={ambito.id} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`modal_ambito_${ambito.id}`}
                          checked={formData.ambitos.includes(ambito.id)}
                          onChange={() => handleAmbitoChange(ambito.id)}
                          disabled={modalMode === "view"}
                        />
                        <label htmlFor={`modal_ambito_${ambito.id}`}>{ambito.nombre}</label>
                      </div>
                    ))}
                  </div>
                </fieldset>

                {modalMode !== "view" && (
                  <div className="flex gap-3 pt-4">
                    <button onClick={handleSubmit} className="submit-btn flex-1">
                      {modalMode === "create" ? "Crear Usuario" : "Guardar Cambios"}
                    </button>
                    <button onClick={closeModal} className="register-btn flex-1">
                      Cancelar
                    </button>
                  </div>
                )}
                {modalMode === "view" && (
                  <button onClick={closeModal} className="submit-btn w-full">
                    Cerrar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-600 border-t">
        <p className="text-sm">
          © 2025 Universidad Católica de Cuyo - Sistema de Responsabilidad Social Universitaria
        </p>
      </footer>
    </div>
  );
}