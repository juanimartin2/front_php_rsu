
import { Routes, Route, Navigate } from "react-router-dom";
import { getUser } from "../auth";
import Login from "../pages/Login";
import Home from "../pages/Home";

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
    </Routes>
  );
}
