import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, XCircle, SlidersHorizontal, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Função para normalizar strings (remove acentos)
  const normalize = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  // Buscar produtos do Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProducts(products);
        setSearchResults(products); // mostra todos no início
      } catch (error) {
        console.error('Erro ao buscar produtos: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Aplica filtros e busca
  useEffect(() => {
    const handler = setTimeout(() => {
      setLoading(true);
      let filtered = allProducts;

      if (searchTerm.trim()) {
        const term = normalize(searchTerm);
        filtered = filtered.filter(
          p =>
            normalize(p.name).includes(term) ||
            normalize(p.description).includes(term) ||
            normalize(p.category).includes(term)
        );
      }

      if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);
      if (minPrice) filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
      if (maxPrice) filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
      if (minRating) filtered = filtered.filter(p => p.rating >= minRating);

      setSearchResults(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, selectedCategory, minPrice, maxPrice, minRating, allProducts]);

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setShowFilters(false);
  };

  const categories = ['all', ...new Set(allProducts.map(p => p.category))];

  return (
    <motion.div className="container mx-auto px-4 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Buscar Produtos</motion.h1>

      {/* Search input */}
      <motion.div className="relative mb-8 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Digite o que você procura..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-6 py-4 pr-12 bg-white border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-gray-900 placeholder-gray-500 font-medium"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          {searchTerm || selectedCategory !== 'all' || minPrice || maxPrice || minRating ? (
            <motion.button onClick={handleClearSearch} className="text-gray-500 hover:text-gray-700" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <XCircle className="w-6 h-6" />
            </motion.button>
          ) : (
            <Search className="w-6 h-6 text-gray-400" />
          )}
        </div>
      </motion.div>

      {/* Filters toggle */}
      <motion.div className="text-center mb-8">
        <motion.button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SlidersHorizontal className="w-5 h-5" />
          {showFilters ? 'Esconder Filtros' : 'Mostrar Filtros Avançados'}
        </motion.button>
      </motion.div>

      {/* Advanced filters */}
      <motion.div initial={false} animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mb-8 max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Categoria:</label>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'Todas as Categorias' : cat}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Preço:</label>
            <div className="flex gap-3">
              <input type="number" placeholder="Mínimo" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-1/2 p-3 border border-gray-300 rounded-lg" />
              <input type="number" placeholder="Máximo" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-1/2 p-3 border border-gray-300 rounded-lg" />
            </div>
          </div>

          {/* Rating */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Avaliação Mínima:</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <motion.button key={star} type="button" onClick={() => setMinRating(star)} className={`p-2 rounded-full ${minRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Star className="w-6 h-6" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {loading && <motion.div className="text-center py-12 text-blue-600 text-lg">Buscando conhecimento...</motion.div>}

      {!loading && searchResults.length > 0 && (
        <motion.div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((product, index) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index + 0.2 }}>
              <ProductCard product={product} className="w-full h-full" />
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && searchResults.length === 0 && (
        <motion.div className="text-center py-12 text-gray-600 text-lg">Nenhum resultado encontrado. Ajuste os filtros e tente novamente!</motion.div>
      )}
    </motion.div>
  );
};

export default SearchPage;
