import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, XCircle } from 'lucide-react';

const CartItemCard = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <motion.div
      className="flex items-center border-b border-gray-200 pb-4 last:border-b-0 last:pb-0 group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={item.image || item.images?.[0]}
        alt={item.name}
        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg mr-4"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="mx-3 font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:text-red-700 ml-2"
      >
        <XCircle className="w-6 h-6" />
      </button>
    </motion.div>
  );
};

export default CartItemCard;
