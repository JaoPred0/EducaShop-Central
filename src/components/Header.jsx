import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ShoppingCart,
  Search,
  UserCircle,
  LogOut,
  User,
  Menu,
  X,
  Home,
  Package,
  Info,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';
import { signOut, sendEmailVerification } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';

const Header = () => {
  const { cartCount } = useCart();
  const [user] = useAuthState(auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsMobileMenuOpen(false);
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const resendVerification = async () => {
    if (!auth.currentUser) {
      toast.error("Você precisa estar logado!");
      return;
    }

    if (!canResend) {
      toast.info("Aguarde antes de reenviar o e-mail.");
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
      setTimeout(() => setCanResend(true), 60000); // 60s de cooldown
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/too-many-requests') {
        toast.error("Muitas solicitações. Aguarde alguns minutos antes de tentar novamente.");
      } else {
        toast.error("Não foi possível reenviar o e-mail. Tente novamente mais tarde.");
      }
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <motion.header
        className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      >
        {/* Aviso de login */}
        {!user && (
          <motion.div
            className="bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500 p-4 text-center font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Você não está logado!{' '}
            <Link to="/login" className="underline font-bold">
              Faça login / registre-se
            </Link>{' '}
            para aproveitar todos os recursos.
          </motion.div>
        )}

        {/* Aviso de verificação de e-mail */}
        {user && !user.emailVerified && (
          <motion.div
            className="bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500 p-4 text-center font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Verifique seu e-mail para ativar sua conta!{' '}
            <Link
              to="/verify-email"
              onClick={resendVerification}
              className={`underline font-bold ${!canResend ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Reenviar e-mail
            </Link>
          </motion.div>
        )}

        {/* Conteúdo do header */}
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={closeMenus}>
            <motion.div
              className=""
              whileHover={{ rotate: 10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/logo.svg" alt="EducaShop Logo" className="w-10 h-10" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              EducaShop Central
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
            <Link to="/sobre" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
              Sobre
            </Link>
          </nav>

          {/* Ícones */}
          <div className="flex items-center gap-4 relative">
            <Link to="/search" className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-300" onClick={closeMenus}>
              <Search className="w-5 h-5" />
            </Link>

            <Link to="/cart" className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-300" onClick={closeMenus}>
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Perfil desktop */}
            <div className="relative hidden md:block">
              <button onClick={toggleProfileMenu} className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-300">
                <UserCircle className="w-6 h-6" />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50"
                  >
                    {user ? (
                      <>
                        <Link to="/profile" onClick={closeMenus} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700">
                          <User className="w-4 h-4" /> Minha Conta
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 text-gray-700">
                          <LogOut className="w-4 h-4" /> Sair
                        </button>
                      </>
                    ) : (
                      <Link to="/login" onClick={closeMenus} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700">
                        <User className="w-4 h-4" /> Entrar / Registrar
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu mobile */}
            <button onClick={toggleMobileMenu} className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-300">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden bg-white border-t border-gray-200/50 py-4"
            >
              <div className="flex flex-col items-start px-4 space-y-3">
                <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium py-2 w-full" onClick={closeMenus}>
                  <Home className="w-5 h-5" /> Início
                </Link>
                <Link to="/products" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium py-2 w-full" onClick={closeMenus}>
                  <Package className="w-5 h-5" /> Produtos
                </Link>
                <Link to="/sobre" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium py-2 w-full" onClick={closeMenus}>
                  <Info className="w-5 h-5" /> Sobre
                </Link>

                <div className="w-full border-t border-gray-200 my-2"></div>

                {user ? (
                  <>
                    <Link to="/profile" onClick={closeMenus} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium py-2 w-full">
                      <User className="w-5 h-5" /> Minha Conta
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium py-2 w-full text-left">
                      <LogOut className="w-5 h-5" /> Sair
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={closeMenus} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium py-2 w-full">
                    <User className="w-5 h-5" /> Entrar / Registrar
                  </Link>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;
