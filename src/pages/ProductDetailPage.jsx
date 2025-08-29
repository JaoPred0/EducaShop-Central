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
  const [selectedImage, setSelectedImage] = useState(null); // <- imagem selecionada
  const navigate = useNavigate();
  const { addToCart } = useCart();

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
    navigate('/checkout', { state: { product } });
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* Imagens do Produto */}
        <motion.div
          className="flex flex-col gap-4 items-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {product.images && product.images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setSelectedImage(img)} // <- abre modal
                  className="cursor-pointer max-h-[300px] w-full object-contain rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500 ease-in-out"
                />
              ))}
            </div>
          ) : product.image ? (
            <img
              src={product.image}
              alt={product.name}
              onClick={() => setSelectedImage(product.image)}
              className="cursor-pointer max-h-[350px] w-full object-contain rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500 ease-in-out"
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
            <motion.button
              onClick={() => addToCart(product)}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-blue-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Adicionar ao Carrinho
            </motion.button>

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

      {/* Modal da Imagem */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          {/* Fundo borrado */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/30"></div>

          {/* Imagem animada */}
          <motion.img
            src={selectedImage}
            alt="Zoom"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-2xl z-10 cursor-pointer"
            initial={{ scale: 0.5, x: '-50vw', y: '-50vh', opacity: 0 }}
            animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, x: '50vw', y: '50vh', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()} // evita fechar ao clicar na imagem
          />
        </motion.div>
      )}

    </motion.div>
  );
};

export default ProductDetailPage;
