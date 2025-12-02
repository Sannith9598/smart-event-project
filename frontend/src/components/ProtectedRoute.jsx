// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// role prop is optional: e.g. role="MANAGER"
export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // role check
  if (role && user.role !== role) {
    // unauthorized - could show a "Not allowed" page instead
    return <Navigate to="/" replace />;
  }

  // allowed
  return children;
}
