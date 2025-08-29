import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { Mail, Rocket, CheckCircle2 } from 'lucide-react'; // Importando ícones necessários
import { auth } from "../firebase/firebase";
import { sendEmailVerification } from "firebase/auth";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0); // Adicionado countdown para o botão

  useEffect(() => {
    let resendTimer;
    if (!canResend && countdown > 0) {
      resendTimer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(resendTimer);
  }, [canResend, countdown]);


  const resendVerification = async () => {
    if (!auth.currentUser) {
      toast.error("Você precisa estar logado!");
      return;
    }

    if (!canResend) {
      toast.info(`Aguarde ${countdown} segundos antes de reenviar o e-mail.`);
      return;
    }

    if (auth.currentUser.emailVerified) {
      toast.success("E-mail já verificado!");
      return;
    }

    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("E-mail de verificação reenviado!");
      setCanResend(false);
      setCountdown(60); // cooldown 60s
    } catch (err) {
      console.error(err);
      if (err.code === "auth/too-many-requests") {
        toast.error("Muitas solicitações. Aguarde alguns minutos antes de tentar novamente.");
      } else {
        toast.error("Não foi possível reenviar o e-mail. Tente novamente mais tarde.");
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      // Certifique-se de que auth.currentUser existe antes de chamar reload()
      await auth.currentUser?.reload();
      setUser(auth.currentUser);
      if (auth.currentUser?.emailVerified) {
        clearInterval(interval);
        toast.success("E-mail verificado!");
        navigate("/"); // redireciona para a página inicial
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 md:p-12 shadow-2xl text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
        >
          <Mail className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
        >
          Verifique seu e-mail
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-gray-600 text-lg mb-6 leading-relaxed"
        >
          Enviamos um link de verificação para seu e-mail. Confirme para acessar o sistema.
          E sim,{" "}
          <span className="font-semibold text-blue-700">
            veja na caixa de spam
          </span>
          , porque a vida é cheia de surpresas.
        </motion.p>

        <motion.button
          onClick={resendVerification}
          disabled={!canResend && countdown > 0}
          className={`mt-4 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 mx-auto ${
            !canResend && countdown > 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
          }`}
          whileHover={canResend || countdown === 0 ? { scale: 1.05 } : {}}
          whileTap={canResend || countdown === 0 ? { scale: 0.95 } : {}}
        >
          {canResend || countdown === 0 ? (
            <>
              <Rocket className="w-6 h-6" />
              Reenviar e-mail
            </>
          ) : (
            <>
              <CheckCircle2 className="w-6 h-6" />
              Reenviar em {countdown}s
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;