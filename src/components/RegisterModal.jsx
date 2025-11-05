import { useState } from "react";
import { register } from "../services/api";

export default function RegisterModal({ isOpen, onClose }) {
  const [nombre, setNombre] = useState("");
  const [cuit, setCuit] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [ambitos, setAmbitos] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!isOpen) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nombre || !cuit || !password || !rol || ambitos.length === 0) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    const res = await register(nombre, cuit, password, rol, ambitos);

    if (res.success) {
      setSuccess("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
      setNombre("");
      setCuit("");
      setPassword("");
      setRol("");
      setAmbitos([]);
    } else {
      setError(res.error || "Error desconocido");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96 text-black">
        <h2 className="text-xl font-bold mb-4">Registrar usuario</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="text"
            placeholder="Nombre Completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="text"
            minLength="11" maxLength="11"
            placeholder="CUIT"
            value={cuit}
            onChange={(e) => setCuit(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <label for="rol">Rol</label>
          <select 
            id="rol"
            name="rol_id" 
            value={rol}  
            onChange={(e) => setRol(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">-- Seleccione un rol --</option>
            <option value="1">Lector</option>
            <option value="2">Operador</option>
            <option value="3">Encargado</option>
            <option value="4">Administrador</option>
          </select>

          <fieldset>
            <legend>Ámbitos a los que pertenece</legend>
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input type="checkbox" id="gestion" 
                onChange={(e) => setAmbitos((prev) => [...prev, e.target.value])} name="ambitos[]" value="1" />
                <label for="gestion">Gestión</label>
                  </div>
                  <div className="checkbox-item">
                      <input type="checkbox" id="docencia" 
                      onChange={(e) => setAmbitos((prev) => [...prev, e.target.value])} name="ambitos[]" value="2" />
                      <label for="docencia">Docencia</label>
                  </div>
                  <div className="checkbox-item">
                      <input type="checkbox" id="investigacion" 
                      onChange={(e) => setAmbitos((prev) => [...prev, e.target.value])} name="ambitos[]" value="3" />
                      <label for="investigacion">Investigación</label>
                  </div>
                  <div className="checkbox-item">
                      <input type="checkbox" id="extension" 
                      onChange={(e) => setAmbitos((prev) => [...prev, e.target.value])} name="ambitos[]" value="4" />
                      <label for="extension">Extensión</label>
                  </div>
              </div>
              <div class="error" id="errorAmbitos">Debe seleccionar al menos un ámbito</div>
          </fieldset>

          <button
            type="submit"
            className="bg-black w-full bg-m text-white hover:text-gray-300 rounded-lg py-2"
          >
            Registrarse
          </button>
        </form>
        <button
          onClick={onClose}
          className="bg-black mt-3 text-white hover:text-gray-300"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
