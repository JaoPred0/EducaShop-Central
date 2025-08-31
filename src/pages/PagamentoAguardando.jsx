import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { motion } from "framer-motion";
import { Clock, XCircle, CheckCircle2, Loader } from "lucide-react";

export default function PagamentoAguardando() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const ref = doc(db, "orders", orderId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPedido(data);
        if (data.status === "Concluído") {
          navigate(`/sucesso/${orderId}`);
        }
      }
    });

    // Abre WhatsApp após 2 segundos
    const timer = setTimeout(() => {
      if (state?.whatsapp && state?.waText) {
        window.open(
          `https://wa.me/${state.whatsapp}?text=${encodeURIComponent(state.waText)}`,
          "_blank"
        );
      }
    }, 2000);

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, [orderId, navigate, state]);

  const cancelar = async () => {
    const ref = doc(db, "orders", orderId);
    await updateDoc(ref, { status: "Cancelado" });
    navigate("/");
  };

  if (!pedido) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-yellow-50 to-orange-100 p-6">
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-t-4 border-yellow-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-yellow-500" />
        </motion.div>
        <motion.p
          className="mt-6 text-xl font-semibold text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Carregando...
        </motion.p>
      </div>
    );
  }

  if (pedido.status === "Cancelado") {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-100 p-6 text-center">
        <XCircle className="w-24 h-24 text-gray-500 mb-6" />
        <h1 className="text-4xl font-bold text-gray-700 mb-4">Pedido Cancelado</h1>
        <p className="text-xl text-gray-600 mb-8">Este pedido foi cancelado.</p>
        <motion.button
          onClick={() => navigate("/")}
          className="px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Voltar para o Início
        </motion.button>
      </div>
    );
  }

  return (
    <div className="inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-yellow-50 to-orange-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-2xl text-center max-w-md w-full border border-yellow-200"
      >
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
        >
          <Clock className="w-14 h-14 text-white" />
        </motion.div>

        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Aguardando Pagamento...
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Cliente: <span className="font-semibold">{pedido.customerName}</span>
        </p>
        <p className="text-2xl font-bold text-gray-800 mb-8">
          Total: R$ <span className="text-orange-600">{pedido.total}</span>
        </p>

        <motion.button
          onClick={cancelar}
          className="px-8 py-4 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <XCircle className="w-5 h-5" />
          Cancelar Pedido
        </motion.button>

        <motion.p
          className="mt-6 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Aguardando a confirmação do seu pagamento.
        </motion.p>
      </motion.div>
    </div>
  );
}
