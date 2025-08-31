import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Home } from "lucide-react";

export default function PagamentoSucesso() {
  const navigate = useNavigate();
  const { orderId } = useParams(); // Se precisar do orderId na tela de sucesso

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-2xl text-center max-w-md w-full border border-green-200"
      >
        <motion.div
          className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
        >
          <CheckCircle2 className="w-16 h-16 text-white" />
        </motion.div>

        <h1 className="text-4xl font-extrabold text-green-700 mb-4">
          Compra Concluída com Sucesso!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Seu pedido foi processado.
          Prepare-se para a felicidade!
        </p>

        <motion.button
          onClick={() => navigate("/")}
          className="px-8 py-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home className="w-5 h-5" />
          Voltar para Home
        </motion.button>

        <motion.p
          className="mt-6 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Agradecemos a sua preferência. Volte sempre!
        </motion.p>
      </motion.div>
    </div>
  );
}