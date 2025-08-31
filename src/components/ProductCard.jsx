import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart } from 'lucide-react'; 
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // movido para dentro do componente
  const [currentImage, setCurrentImage] = useState(
    product.images?.[0] || product.image || ''
  );

  return (
    <motion.div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer
                 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Imagem principal */}
      <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden flex-shrink-0">
        {currentImage ? (
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
            Sem imagem
          </div>
        )}
      </div>

      {/* Conteúdo do cartão */}
      <div className="p-4 flex flex-col flex-grow">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 truncate mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        </div>

        {/* Miniaturas */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-1 mt-2 mb-4">
            {product.images.map((img, idx) => (
              <motion.div
                key={idx}
                className={`w-7 h-7 rounded-full border-2 ${
                  currentImage === img ? 'border-blue-500 shadow-md' : 'border-gray-200'
                } overflow-hidden cursor-pointer transition-all duration-200`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage(img);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <img src={img} alt={`Mini ${idx}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        )}

        <p className="text-xl font-bold text-green-600 mt-auto mb-4">
          R$ {product.price?.toFixed(2)}
        </p>

        {/* Botões */}
        <div className="flex gap-2 mt-auto">
          <motion.button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md
                       hover:bg-blue-600 transition-colors duration-200"
            onClick={() => navigate(`/products/${product.id}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-5 h-5" />
            <span className="hidden sm:inline">Ver Detalhes</span>
          </motion.button>
          <motion.button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md
                       hover:bg-green-600 transition-colors duration-200"
            onClick={() => addToCart(product)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Carrinho</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
