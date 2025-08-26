import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(fetched);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja apagar este produto?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts(); // atualiza a lista após deletar
      } catch (error) {
        console.error('Erro ao apagar produto:', error);
      }
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <motion.div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Produtos</h1>
        <button
          onClick={() => navigate('/add-product')}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Adicionar Produto
        </button>
      </div>

      {/* Filtro */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {cat === 'all' ? 'Todas' : cat}
          </button>
        ))}
      </div>

      {/* Lista de produtos */}
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  Sem imagem
                </div>
              )}

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="font-bold text-green-600">R$ {product.price?.toFixed(2)}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/edit-product/${product.id}`)}
                    className="flex-1 bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500 flex items-center justify-center gap-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-1"
                  >
                    Apagar
                  </button>
                </div>
              </div>
            </div>

          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProductsPage;
