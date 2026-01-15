import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  // ⏳ mientras se resuelve la sesión
  if (loading) return null; // o spinner

  // 🔐 no logueado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ⛔ no admin
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ autorizado
  return children;
}
