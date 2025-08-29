import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart(); // contexto do carrinho

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

  const handleBuyNow = () => {
    navigate('/checkout', { state: { product } }); // manda direto p/ checkout
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Imagem do Produto */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[350px] w-full object-contain rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            ) : (
              <div className="h-48 w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                Sem imagem
              </div>
            )}
        </motion.div>

        {/* Informações do Produto */}
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold mb-3 text-gray-800">
            {product.name}
          </h1>
          <p className="text-gray-500 text-sm md:text-base mb-2 italic">
            {product.category}
          </p>
          <p className="text-green-600 font-extrabold text-xl md:text-2xl mb-4">
            R$ {product.price?.toFixed(2)}
          </p>
          <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
            {product.description}
          </p>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Adicionar ao Carrinho */}
            <motion.button
              onClick={() => addToCart(product)}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-blue-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Adicionar ao Carrinho
            </motion.button>

            {/* Comprar Agora */}
            <motion.button
              onClick={handleBuyNow}
              className="bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-emerald-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Comprar Agora
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
