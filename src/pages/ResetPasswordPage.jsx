import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { auth } from "../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Por favor, insira seu e-mail.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(
        "E-mail enviado! Verifique sua caixa de entrada para redefinir a senha."
      );
      setEmail("");
    } catch (error) {
      toast.error("Erro ao enviar e-mail: " + error.message);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Redefinir Senha
          </h1>
          <p className="text-gray-600 mb-6">
            Insira o e-mail da sua conta e enviaremos um link para redefinir sua
            senha.
          </p>

          <div className="relative mb-6">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </div>

          <motion.button
            onClick={handleResetPassword}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-blue-700 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Enviar Link de Redefinição
          </motion.button>

          <p className="mt-6 text-gray-600">
            Lembrou a senha?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Voltar ao login
            </button>
          </p>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ResetPasswordPage;
