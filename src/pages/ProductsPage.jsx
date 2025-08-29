import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

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
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${selectedCategory === category
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200/50 animate-pulse"
            >
              <div className="w-full h-32 sm:h-40 bg-gray-200"></div>
              <div className="p-3">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
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
