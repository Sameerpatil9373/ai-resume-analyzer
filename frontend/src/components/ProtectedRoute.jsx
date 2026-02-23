import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  
  if (!user?.token) {
    // If no valid token exists, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;