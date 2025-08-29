// ProtectedRoute.jsx
import { getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const auth = getAuth();
  const user = auth.currentUser;

  const admin1Email = "jhon.pitere163@gmail.com";
  const admin2Email = "educashopcentral@gmail.com";

  if (!user || user.email !== admin1Email && user.email !== admin2Email) {
    // Se não estiver logado ou não for admin, redireciona
    return <Navigate to="/" replace />;
  }

  // Se for admin, permite acesso
  return children;
}
