import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  
  if (!user) {
    // If no user token exists, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;