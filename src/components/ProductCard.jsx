import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(
    product.images?.[0] || product.image || ''
  );

  return (
    <motion.div
      className="bg-white rounded-xl shadow p-3 relative group cursor-pointer overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Imagem principal */}
      {currentImage ? (
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-32 sm:h-40 object-cover rounded-lg mb-2"
        />
      ) : (
        <div className="h-32 sm:h-40 w-full bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-gray-400">
          Sem imagem
        </div>
      )}

      {/* Informações */}
      <h3 className="font-bold text-sm sm:text-base">{product.name}</h3>
      <p className="text-gray-600 text-xs sm:text-sm">{product.category}</p>
      <p className="text-green-600 font-bold text-sm">R$ {product.price?.toFixed(2)}</p>

      {/* Miniaturas se houver várias imagens */}
      {product.images && product.images.length > 1 && (
        <div className="flex gap-1 mt-2">
          {product.images.map((img, idx) => (
            <div
              key={idx}
              className={`w-6 h-6 rounded-full border ${
                currentImage === img ? 'border-blue-600' : 'border-gray-300'
              } overflow-hidden cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImage(img);
              }}
            >
              <img src={img} alt={`Mini ${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;
