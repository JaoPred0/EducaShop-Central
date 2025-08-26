import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <motion.div
      className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-4 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
      >
        <Frown className="w-12 h-12 text-red-500" />
      </motion.div>
      <motion.h1
        className="text-5xl font-extrabold text-gray-800 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        404
      </motion.h1>
      <motion.p
        className="text-2xl text-gray-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Ops! Página não encontrada.
      </motion.p>
      <motion.p
        className="text-lg text-gray-500 mb-10 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Parece que você se perdeu no vasto universo do conhecimento. Não se preocupe, vamos te guiar de volta.
      </motion.p>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Link
          to="/"
          className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Voltar para a Página Inicial
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;