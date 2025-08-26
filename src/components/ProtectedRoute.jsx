// ProtectedRoute.jsx
import { getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const auth = getAuth();
  const user = auth.currentUser;

  const adminEmail = "jhon.pitere163@gmail.com";

  if (!user || user.email !== adminEmail) {
    // Se não estiver logado ou não for admin, redireciona
    return <Navigate to="/" replace />;
  }

  // Se for admin, permite acesso
  return children;
}
