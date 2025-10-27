import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterModal from "../components/RegisterModal";
import { login } from "../services/api";
import Logo from "../assets/logo-ucc.svg";
import { setUser, getUser } from "../auth";

export default function Login() {
  const navigate = useNavigate();
  const [cuit, setCuit] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Si ya hay sesión, redirigir a HOME
  useEffect(() => {
    const user = getUser();
    if (user) navigate("/home");
  }, [navigate]);

  // Formato automático de CUIT
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
    
    setCuit(formatted);
    
    // Limpiar error al escribir
    if (error) setError("");
  };

  // Valida CUIT antes de enviar
  const validarCuit = (cuitStr) => {
    const cuitLimpio = cuitStr.replace(/[-\s]/g, '');
    
    // Valida longitud
    if (!/^[0-9]{11}$/.test(cuitLimpio)) {
      return { valido: false, mensaje: "El CUIT debe tener 11 dígitos" };
    }
    
    // Valida tipo
    const tipo = parseInt(cuitLimpio.substring(0, 2));
    const tiposValidos = [20, 23, 24, 27, 30, 33, 34];
    if (!tiposValidos.includes(tipo)) {
      return { 
        valido: false, 
        mensaje: "Tipo de CUIT inválido. Debe comenzar con: 20, 23, 24, 27, 30, 33 o 34" 
      };
    }
    
    // Calcula dígito verificador
    const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    
    for (let i = 0; i < 10; i++) {
      suma += parseInt(cuitLimpio[i]) * multiplicadores[i];
    }
    
    const resto = suma % 11;
    let digitoEsperado;
    
    if (resto === 0) {
      digitoEsperado = 0;
    } else if (resto === 1) {
      if (tipo === 20) {
        digitoEsperado = 9;
      } else if (tipo === 27) {
        digitoEsperado = 4;
      } else {
        return { valido: false, mensaje: "CUIT inválido" };
      }
    } else {
      digitoEsperado = 11 - resto;
    }
    
    const verificador = parseInt(cuitLimpio[10]);
    
    if (verificador !== digitoEsperado) {
      return { 
        valido: false, 
        mensaje: `Dígito verificador incorrecto. Esperado: ${digitoEsperado}` 
      };
    }
    
    return { valido: true, mensaje: "CUIT válido" };
  };

  // VALIDACIONES y SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Valida campos vacíos
    if (!cuit || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // Valida longitud de contraseña
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    // Valida CUIT completo
    const validacion = validarCuit(cuit);
    if (!validacion.valido) {
      setError(validacion.mensaje);
      return;
    }

    setLoading(true);

    try {
      const res = await login(cuit, password);

      if (res && res.success) {
        // Guardar usuario en localStorage
        setUser(res.user);
        navigate("/home"); // Redirigir a HOME
      } else {
        setError(res.error || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Handler cuando register modal retorna usuario
  const onRegistered = (user) => {
    // Autocompletar CUIT en el login
    if (user && user.cuit) {
      setCuit(user.cuit);
    }
  };

  // Manejo de ENTER para submit
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="login-form">
    
        <div className="imgBox flex justify-center mb-4">
          <img src={Logo} alt="logo_ucc" height="auto" width="20%" id="image-section"/>
        </div>

        <label className="text-2xl mb-4">Responsabilidad Social Universitaria | UCC</label>
        <h2 className="text-2xl mb-6">Iniciar Sesión</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={cuit}
              onChange={handleCuitChange}
              onKeyPress={handleKeyPress}
              placeholder="Ingrese Nº de CUIL/CUIT (ej: 20-12345678-9)"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={13}
              required
            />
          </div>

          <div className="input-group relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder="Contraseña (mínimo 8 caracteres)"
              className="w-full border rounded-lg px-3 py-2 mb-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
             <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
            </button>
          </div>
      
          <button 
            type="submit" 
            className="submit-btn disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <button
          onClick={() => setShowRegister(true)}
          className="register-btn"
          disabled={loading}
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