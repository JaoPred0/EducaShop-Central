import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const CategoryProductsPage = () => {
  const { category } = useParams(); // pega a categoria da URL
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, 'products');

        // Busca produtos da categoria exata
        const q = query(productsRef, where('category', '==', category));
        const snapshot = await getDocs(q);

        const productsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsList);
      } catch (error) {
        console.error('Erro ao buscar produtos da categoria:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 font-semibold mb-6 hover:underline"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar
      </button>

      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Produtos da categoria: {category.charAt(0).toUpperCase() + category.slice(1)}
      </h2>

      {loading ? (
        <p className="text-center">Carregando produtos...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-red-500">Nenhum produto encontrado nesta categoria.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;
