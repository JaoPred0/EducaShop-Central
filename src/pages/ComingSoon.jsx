import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket, BookOpen, Code, Users, Smile, Bell } from 'lucide-react';

const ComingSoon = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const word = "EducaHub";
  const asterisks = "->"; // 7 asteriscos para combinar com o exemplo

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900">
      {/* Hero Section - Coming Soon */}
      <section className="relative bg-gradient-to-br from-purple-700 to-pink-600 text-white py-20 md:py-32 flex justify-center items-center overflow-hidden shadow-2xl">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            {word.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
            <motion.span
              className="inline-block ml-2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: word.length * 0.05 + 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
            >
              {asterisks.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ delay: word.length * 0.05 + 0.3 + index * 0.1, duration: 0.4 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
            <motion.span
              className="inline-block ml-2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: word.length * 0.05 + asterisks.length * 0.1 + 0.5, duration: 0.5, type: "spring", stiffness: 200 }}
            >
              Está Chegando!
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            Prepare-se para uma experiência completa! Em breve teremos:
            <ul className="mt-6 list-none space-y-3 text-left max-w-md mx-auto">
              <motion.li
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <Users className="w-6 h-6 text-white" /> Área de Trabalho colaborativa
              </motion.li>
              <motion.li
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.9, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <BookOpen className="w-6 h-6 text-white" /> Área de Estudos personalizada
              </motion.li>
              <motion.li
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 2.1, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <Code className="w-6 h-6 text-white" /> Seção para Programadores e Hackers
              </motion.li>
              <motion.li
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 2.3, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <Rocket className="w-6 h-6 text-white" /> Recursos educativos inovadores
              </motion.li>
              <motion.li
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <Smile className="w-6 h-6 text-white" /> E muito mais surpresas para você explorar!
              </motion.li>
            </ul>
          </motion.p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.8, duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center bg-white text-purple-700 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300"
            >
              Voltar à Home
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Área de detalhes adicionais */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.h3
          className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.5 }}
        >
          Por que será incrível?
        </motion.h3>
        <motion.p
          className="text-lg max-w-2xl mx-auto text-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.4, duration: 0.5 }}
        >
          Nossa plataforma reunirá tudo que você precisa em um só lugar. Seja para estudar, programar,
          criar projetos ou explorar novas habilidades, Educa será sua nova área favorita.
        </motion.p>
      </section>

      {/* Call to Action Section */}
      <section className="bg-purple-100 py-16 text-center shadow-inner">
        <div className="container mx-auto px-4">
          <motion.h3
            className="text-3xl md:text-4xl font-bold mb-4 text-purple-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.8, duration: 0.6 }}
          >
            Não perca o lançamento!
          </motion.h3>
          <motion.p
            className="text-xl text-purple-700 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.0, duration: 0.6 }}
          >
            Fique ligado para as últimas atualizações e seja um dos primeiros a explorar.
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default ComingSoon;