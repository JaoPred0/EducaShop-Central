import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import RowSection from '../components/RowSection';
import { categories } from "../data/categorias";


const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);


  // Quantas linhas mostrar inicialmente no desktop
  const maxRows = 2;
  const itemsPerRow = 5; // colunas no grid desktop
  const maxItems = maxRows * itemsPerRow;

  const displayedCategories = showAll ? categories : categories.slice(0, maxItems);
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'products'), limit(4));
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Erro ao buscar produtos: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

      {/* Hero Section */}
      <RowSection />
      {/* Área de acesso */}
      <section className="container mx-auto px-4 py-12">
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Áreas de Acesso
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Estudantes */}
          <Link
            to="/area-estudantes"
            className="bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-10 rounded-2xl text-center shadow-md transition-all duration-300"
          >
            Área para Estudantes
          </Link>

          {/* Professor */}
          <Link
            to="/area-professor"
            className="bg-purple-100 hover:bg-purple-300 text-purple-800 font-semibold py-10 rounded-2xl text-center shadow-md transition-all duration-300"
          >
            Área para Professor
          </Link>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <motion.h2
          className="text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Categorias
        </motion.h2>

        {/* GRID desktop */}
        <div className="hidden md:grid md:grid-cols-5 gap-6">
          <AnimatePresence>
            {displayedCategories.map((cat) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  to={`/category/${cat.slug}`}
                  className="block bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 
                       text-blue-900 font-semibold py-5 px-6 rounded-xl shadow-md 
                       hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  {cat.name}
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* SCROLL horizontal para mobile */}
        <div className="flex md:hidden space-x-4 overflow-x-auto scrollbar-hide py-4 px-1">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="flex-shrink-0 min-w-[140px] text-center 
                   bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 
                   text-blue-900 font-semibold py-4 px-5 rounded-xl shadow-md 
                   hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Botão Mostrar Mais / Menos */}
        {categories.length > maxItems && (
          <div className="text-center mt-8 md:block hidden">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-7 rounded-full shadow-md transition-all duration-300"
            >
              {showAll ? "Mostrar Menos" : "Mostrar Mais"}
            </button>
          </div>
        )}
      </section>


      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <motion.h2 className="text-3xl font-bold text-gray-800 mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Destaques da Semana
        </motion.h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200/50 animate-pulse">
                <div className="w-full h-32 sm:h-40 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <motion.div className="text-center mt-10">
          <Link to="/products" className="inline-flex items-center text-blue-600 font-semibold hover:underline">
            Ver todos os produtos
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default HomePage;
