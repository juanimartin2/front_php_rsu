import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterModal from "../components/RegisterModal";
import { login } from "../services/api";
import Logo from "../public/logo-ucc.svg?react";
import { setUser, getUser } from "../auth";

export default function Login() {
  const navigate = useNavigate();
  const [cuit, setCuit] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  // si ya hay sesión, se redirige a /home
  useEffect(() => {
    const user = getUser();
    if (user) navigate("/home");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const res = await login(email, password);

    if (res && res.success) {
      // guardamos el user devuelto por el backend en localStorage
      setUser(res.user);
      navigate("/home");
    } else {
      setError(res.error || "Credenciales incorrectas");
    }
  };

  // handler cuando register modal retorna usuario
  const onRegistered = (user) => {
    // autocompletar email en el login
    if (user && user.email) setEmail(user.email);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="login-form">
    
        <div className="imgBox flex justify-center mb-4">
          <img src={Logo} alt="logo_ucc" height="auto" width="20%" id="image-section"/>
        </div>

        <label className="text-2xl mb-4">Responsabilidad Social Universitaria | UCC</label>
        <h2 className="text-2xl mb-6">Iniciar Sesión</h2>

        {error && <div className="text-red-500 mb-3">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              placeholder="Ingrese Nº de CUIL/CUIT"
              className="w-full border rounded-lg px-3 py-2 mb-4"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full border rounded-lg px-3 py-2 mb-4"
              required
            />
          </div>
      
          <button type="submit" className="submit-btn">
            Entrar
          </button>
        </form>

        <button
          onClick={() => setShowRegister(true)}
          className="register-btn"
        >
          Registrarse
        </button>
      </div>

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegistered={onRegistered}
      />
    </div>
  );
}
