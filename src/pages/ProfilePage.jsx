import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Formata datas do Firebase para dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Você saiu da sua conta!");
      navigate("/auth");
    } catch (err) {
      toast.error("Erro ao sair: " + err.message);
    }
  };

  // Verifica se é admin
  const isAdmin = user?.email === "jhon.pitere163@gmail.com";

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl flex flex-col items-center text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Foto do usuário */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-4">
          <img
            src={user?.photoURL || "https://i.pravatar.cc/150?img=3"}
            alt={user?.displayName || "Usuário"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Nome */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.displayName || "Usuário sem nome"}</h1>

        {/* Email */}
        <p className="text-gray-600 mb-4">{user?.email}</p>

        {/* Datas */}
        <div className="flex flex-col sm:flex-row sm:gap-6 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 shadow-md mb-4 sm:mb-0">
            <p className="text-gray-500 text-sm">Conta criada em</p>
            <span className="font-bold text-gray-800">{formatDate(user?.metadata?.creationTime)}</span>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 shadow-md">
            <p className="text-gray-500 text-sm">Último login</p>
            <span className="font-bold text-gray-800">{formatDate(user?.metadata?.lastSignInTime)}</span>
          </div>
        </div>

        {/* Botão de dashboard só para admin */}
        {isAdmin && (
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="mb-4 w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-yellow-600 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Acessar Dashboard
          </motion.button>
        )}

        {/* Botão de logout */}
        <motion.button
          onClick={handleLogout}
          className="mt-2 w-full bg-red-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-red-600 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sair da Conta
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
