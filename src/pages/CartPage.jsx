import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import CartItemCard from '../components/CartItemCard';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate('/login');
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (!user) return null;

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-4xl font-bold text-gray-800 mb-8 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Seu Carrinho de Compras
      </motion.h1>

      {cartItems.length === 0 ? (
        <motion.div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 text-center shadow-xl">
          <motion.div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-blue-500" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Seu carrinho está vazio!
          </h3>
          <p className="text-gray-500 font-medium mb-6">
            Que tal adicionar alguns materiais de estudo para começar sua jornada?
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Explorar Produtos
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Itens do carrinho */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Itens no Carrinho</h2>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>
          </div>

          {/* Resumo do pedido */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 border border-gray-200/50 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumo do Pedido</h2>
            <div className="flex justify-between text-xl font-bold text-gray-700 mb-6 border-t border-gray-200 pt-3">
              <span>Total:</span>
              <span>R$ {cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-green-700"
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CartPage;
