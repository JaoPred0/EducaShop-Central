import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { auth } from "../firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AuthPage = ({ clearCart }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const getFriendlyErrorMessage = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "O email informado é inválido.";
      case "auth/user-not-found":
        return "Conta não encontrada. Verifique o email.";
      case "auth/wrong-password":
        return "Senha incorreta. Tente novamente.";
      case "auth/email-already-in-use":
        return "Este email já está em uso.";
      case "auth/weak-password":
        return "A senha precisa ter pelo menos 6 caracteres.";
      case "auth/popup-closed-by-user":
        return "Login com Google cancelado.";
      default:
        return "Ocorreu um erro. Tente novamente.";
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Informe seu e-mail para redefinir a senha.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
    } catch (error) {
      toast.error("Erro ao enviar e-mail: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        if (!user.emailVerified) {
          toast.error("Verifique seu e-mail antes de entrar!");
          await auth.signOut();
          return;
        }

        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: name });
        await sendEmailVerification(userCred.user);

        toast.success("Conta criada! Verifique seu e-mail para ativar a conta.");
        setIsLogin(true);
        navigate("/verify-email");
      }
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error.code));
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);

      if (!userCred.user.emailVerified) {
        toast.error("Verifique seu e-mail antes de entrar!");
        await auth.signOut();
        return;
      }

      toast.success("Login com Google realizado!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error.code));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Você saiu da conta!");
      if (clearCart) clearCart();
      navigate("/auth");
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err.code));
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <motion.div
        className="min-h-[calc(100vh-150px)] flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-purple-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row w-full max-w-5xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Lado da imagem */}
          <div className="relative hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-8">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1974&auto=format&fit=crop"
              alt="Estudando"
              className="w-full h-full object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Lado do formulário */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-6 text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {isLogin ? "Login" : "Crie sua conta"}
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Seu Nome"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Seu Email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="Sua Senha"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {isLogin && (
                <p className="text-right mt-2">
                  <Link
                    to="/reset-password"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Esqueci minha senha
                  </Link>
                </p>
              )}


              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLogin ? "Entrar" : "Registrar"}
              </motion.button>
            </form>

            {/* Botão Google */}
            <motion.button
              onClick={handleGoogleAuth}
              className="mt-6 w-full flex items-center justify-center gap-3 bg-red-500 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-red-600 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLogin ? "Entrar com Google" : "Registrar com Google"}
            </motion.button>

            {/* Toggle */}
            <p className="text-center text-gray-600 mt-8">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-semibold ml-2 hover:underline"
              >
                {isLogin ? "Registre-se" : "Entrar"}
              </button>
            </p>

            {/* Logout */}
            {auth.currentUser && (
              <motion.button
                onClick={handleLogout}
                className="mt-4 w-full bg-gray-600 text-white py-2 rounded-xl hover:bg-gray-700 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sair da Conta
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default AuthPage;
