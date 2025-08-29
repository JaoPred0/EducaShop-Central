import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Mail } from 'lucide-react';
import { FaInstagram, FaTiktok } from 'react-icons/fa'; // Ícones do Instagram e TikTok
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <motion.footer
      className="bg-gradient-to-br from-gray-900 to-gray-700 text-gray-300 py-12 mt-16 shadow-inner"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Logo e Título */}
        <Link to="/" className="flex items-center gap-3 mb-6 md:mb-0">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <img src="/logo.svg" alt="EducaShop Logo" className="w-10 h-10" />
          </motion.div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            EducaShop Central
          </h1>
        </Link>

        {/* Direitos Autorais */}
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold text-gray-200 mb-2">Seu portal do conhecimento</p>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} EducaShop Central. Todos os direitos reservados.
          </p>
        </div>

        {/* Ícones de Redes Sociais */}
        <div className="flex justify-center gap-6">
          <motion.a
            href="https://www.instagram.com/educashop.central"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-pink-500 transition-colors duration-300 p-2 rounded-full hover:bg-gray-800"
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.8 }}
          >
            <FaInstagram className="w-7 h-7" />
          </motion.a>

          <motion.a
            href="https://www.tiktok.com/@educashop.central"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-black transition-colors duration-300 p-2 rounded-full hover:bg-gray-800"
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.8 }}
          >
            <FaTiktok className="w-7 h-7" />
          </motion.a>

          <motion.a
            href="mailto:educashopcentral@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors duration-300 p-2 rounded-full hover:bg-gray-800"
            whileHover={{ scale: 1.3, rotate: -15 }}
            whileTap={{ scale: 0.8 }}
          >
            <Mail className="w-7 h-7" />
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
