import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // preço tratado
  const productPrice =
    product.price !== undefined
      ? `R$ ${Number(product.price).toFixed(2)}`
      : "Preço indisponível";

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200/50 cursor-pointer"
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/products/${product.id}`}>
        {/* Imagem */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 sm:h-40 object-cover rounded"
        />


        {/* Conteúdo */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
            {product.name || "Produto sem nome"}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            {product.category || "Sem categoria"}
          </p>

          {/* Preço */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">{productPrice}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
