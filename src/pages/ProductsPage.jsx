import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import ReactMarkdown from "react-markdown";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetched);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Categorias
  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <motion.div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold text-gray-800 mb-8 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Produtos
      </motion.h1>

      {/* Filtro de categorias */}
      <motion.div className="mb-8 flex flex-wrap justify-center gap-3">
        {categories.map(category => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category === 'all' ? <Filter className="w-4 h-4" /> : null}
            {category === 'all' ? 'Todas' : category}
            {selectedCategory === category && category !== 'all' && (
              <X className="w-4 h-4 ml-1" />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Lista de produtos */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200/50 animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-5">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded-lg w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-xl shadow p-4 relative group cursor-pointer overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* Imagem */}
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="h-48 w-full bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                  Sem imagem
                </div>
              )}

              <h3 className="font-bold">{product.name}</h3>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-green-600 font-bold">R$ {product.price?.toFixed(2)}</p>
              <p className="text-gray-700">Estoque: {product.stock}</p>

              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded flex items-center"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  Ver Mais <Eye className="ml-1 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <motion.div className="text-center py-12 text-gray-600 text-lg">
          Nenhum produto encontrado nesta categoria.
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductsPage;
