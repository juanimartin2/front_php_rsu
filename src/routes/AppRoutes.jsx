
import { Routes, Route, Navigate } from "react-router-dom";
import { getUser } from "../auth";
import Login from "../pages/Login";
import Home from "../pages/Home";
import PerfilUsuario from "../pages/PerfilUsuario";
import Usuarios from "../pages/Usuarios";
import ConfigPage from "../pages/ConfigPage";

function PrivateRoute({ children }) {
  const user = getUser();
  return user ? children : <Navigate to="/" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="/perfil" element={<PerfilUsuario />} />
      <Route path="/usuarios" element={<Usuarios />} />
     <Route path="/config" element={<ConfigPage />} />
    </Routes>
  );
}
