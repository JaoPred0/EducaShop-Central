import { getAuth, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Calendar, Clock, LayoutDashboard, LogOut, MailCheck, Mail } from "lucide-react";

export default function ProfilePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Você saiu da sua conta!");
      navigate("/login");
    } catch (err) {
      toast.error("Erro ao sair: " + err.message);
    }
  };

  const isAdmin = user?.email === "jhon.pitere163@gmail.com" || user?.email === "educashopcentral@gmail.com";

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-3xl flex flex-col items-center text-center border border-indigo-200"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Foto do usuário */}
        <motion.div className="w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg mb-6 flex items-center justify-center bg-gray-100">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user?.displayName || "Usuário Desconhecido"}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-gray-400" /> // Ícone do usuário
          )}
        </motion.div>

        {/* Nome */}
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 leading-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {user?.displayName || "Usuário Misterioso"}
        </motion.h1>

        {/* Email */}
        <motion.p
          className="text-gray-600 text-lg mb-2 font-medium"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {user?.email}
        </motion.p>

        {/* Status do e-mail */}
        <motion.div
          className={`mb-6 flex items-center gap-2 ${user?.emailVerified ? "text-green-700" : "text-yellow-700"}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {user?.emailVerified ? (
            <>
              <MailCheck className="w-5 h-5" />
              E-mail verificado!
            </>
          ) : (
            <>
              <Mail className="w-5 h-5" />
              E-mail não verificado!{" "}
              <Link to="/verify-email" className="underline font-bold">
                Clique aqui para verificar
              </Link>
            </>
          )}
        </motion.div>

        {/* Datas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 w-full">
          <motion.div
            className="bg-indigo-50 rounded-2xl p-5 shadow-md flex flex-col items-center justify-center border border-indigo-200"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Calendar className="w-8 h-8 text-indigo-600 mb-2" />
            <p className="text-gray-600 text-sm font-medium">Conta criada em</p>
            <span className="font-bold text-gray-800 text-lg">{formatDate(user?.metadata?.creationTime)}</span>
          </motion.div>
          <motion.div
            className="bg-purple-50 rounded-2xl p-5 shadow-md flex flex-col items-center justify-center border border-purple-200"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Clock className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-gray-600 text-sm font-medium">Último login</p>
            <span className="font-bold text-gray-800 text-lg">{formatDate(user?.metadata?.lastSignInTime)}</span>
          </motion.div>
        </div>

        {/* Botão de dashboard só para admin */}
        {isAdmin ? (
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="mb-4 w-full max-w-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(245, 158, 11, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <LayoutDashboard className="w-6 h-6" />
            Acessar Dashboard
          </motion.button>
        ) : (
          <p className="text-sm text-gray-500 italic mt-2">
            Apenas contas autorizadas podem acessar o Dashboard.
          </p>
        )}

        {/* Botão de logout */}
        <motion.button
          onClick={handleLogout}
          className="mt-2 w-full max-w-xs bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(239, 68, 68, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: isAdmin ? 0.9 : 0.8, duration: 0.5 }}
        >
          <LogOut className="w-6 h-6" />
          Sair da Conta
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
