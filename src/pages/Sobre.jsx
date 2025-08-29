import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { Mail, Phone } from 'lucide-react';

const Sobre = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Sobre o EducaShop</h2>
        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
          O EducaShop é uma plataforma criada para apoiar estudantes e professores, oferecendo materiais de estudo já prontos, resumos, exercícios e recursos educativos de qualidade. Nosso objetivo é facilitar o aprendizado e economizar tempo na preparação de aulas e estudos.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.a
          href="https://www.instagram.com/educashop.central"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaInstagram className="w-6 h-6" />
          <span className="font-medium">Instagram</span>
        </motion.a>

        <motion.a
          href="https://www.tiktok.com/@educashop.central"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTiktok className="w-6 h-6" />
          <span className="font-medium">TikTok</span>
        </motion.a>

        <motion.a
          href="mailto:educashopcentral@gmail.com"
          className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Mail className="w-6 h-6" />
          <span className="font-medium">Email</span>
        </motion.a>

        <motion.a
          href="tel:+5567996610494"
          className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Phone className="w-6 h-6" />
          <span className="font-medium">(67) 99661-0494</span>
        </motion.a>
      </div>
    </section>
  );
};

export default Sobre;
