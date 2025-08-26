import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ShoppingCart, Search, UserCircle, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';

const Header = () => {
  const { totalItems } = useCart();
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    navigate('/login');
  };

  return (
    <motion.header
      className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <motion.div
            className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"
            whileHover={{ rotate: 10, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            EducaShop
          </h1>
        </Link>

        {/* Links desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
            Início
          </Link>
          <Link to="/products" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
            Produtos
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
            Sobre
          </Link>
        </nav>

        {/* Ícones lado direito */}
        <div className="flex items-center gap-4 relative">
          <Link
            to="/search"
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-300"
          >
            <Search className="w-5 h-5" />
          </Link>

          <Link
            to="/cart"
            className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Perfil com popover */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-300"
            >
              <UserCircle className="w-6 h-6" />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50"
                >
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        <User className="w-4 h-4" /> Minha Conta
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 text-gray-700"
                      >
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      <User className="w-4 h-4" /> Entrar / Registrar
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
