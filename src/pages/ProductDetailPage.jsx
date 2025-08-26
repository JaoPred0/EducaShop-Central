import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext'; // importa o contexto do carrinho

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // função para adicionar ao carrinho

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('Produto não encontrado!');
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center py-10">Carregando...</p>;
  if (!product) return <p className="text-center py-10">Produto não encontrado!</p>;

  return (
    <motion.div
      className="container mx-auto px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagem */}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full object-cover rounded-lg mb-3"
          />
        ) : (
          <div className="h-48 w-full bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}

        {/* Detalhes */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-2">{product.category}</p>
          <p className="text-green-600 font-bold text-2xl mb-4">R$ {product.price?.toFixed(2)}</p>
          <p className="text-gray-700 mb-6 whitespace-pre-line">{product.description}</p>

          {/* Botão Adicionar ao Carrinho */}
          <motion.button
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Adicionar ao Carrinho
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
