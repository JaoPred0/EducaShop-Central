import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import ReactMarkdown from "react-markdown";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    discount: '',
    description: '',
    image: '',
    offer: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    const { name, price, category, description, image, offer, discount } = formData;
    if (!name || !price || !category || !image) return;

    const newProduct = {
      name,
      price: parseFloat(price),
      category,
      description,
      image,
      offer,
      discount: discount ? parseFloat(discount) : 0,
    };

    try {
      await addDoc(collection(db, 'products'), newProduct);
      navigate('/products'); // volta para a lista
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10">
      {/* Formulário */}
      <motion.div
        className="flex-1 bg-white p-6 rounded-2xl shadow-lg"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="text-2xl font-bold mb-6">Adicionar Produto</h2>

        <div className="flex flex-col gap-4">
          <input type="text" name="name" placeholder="Nome" value={formData.name} onChange={handleChange} className="px-4 py-3 border rounded-lg" />
          <input type="number" name="price" placeholder="Preço" value={formData.price} onChange={handleChange} className="px-4 py-3 border rounded-lg" />
          <input type="number" name="discount" placeholder="Desconto (%)" value={formData.discount} onChange={handleChange} className="px-4 py-3 border rounded-lg" />
          <input type="text" name="category" placeholder="Categoria" value={formData.category} onChange={handleChange} className="px-4 py-3 border rounded-lg" />
          <textarea name="description" placeholder="Descrição" value={formData.description} onChange={handleChange} className="px-4 py-3 border rounded-lg resize-none" />
          <input type="text" name="image" placeholder="URL da imagem" value={formData.image} onChange={handleChange} className="px-4 py-3 border rounded-lg" />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="offer" checked={formData.offer} onChange={handleChange} className="h-4 w-4" />
            Produto em Oferta
          </label>
          <button onClick={handleSubmit} className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors">Salvar Produto</button>
        </div>
      </motion.div>

      {/* Preview do Card */}
      <motion.div className="flex-1 flex justify-center items-start" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-80">
          {formData.image ? (
            <img src={formData.image} alt={formData.name} className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
              Sem imagem
            </div>
          )}
          <div className="p-6">
            <h3 className="font-bold text-gray-900 mb-1">{formData.name || 'Nome do Produto'}</h3>
            <p className="text-sm text-gray-600 mb-2">{formData.category || 'Categoria'}</p>
            {formData.discount ? (
              <p className="text-sm line-through text-gray-400">R$ {formData.price || 0}</p>
            ) : null}
            <p className="font-bold text-green-600">
              R$ {formData.discount ? ((formData.price * (100 - formData.discount)) / 100).toFixed(2) : formData.price || 0}
            </p>
            <p className="text-gray-700 mt-2 whitespace-pre-line">
              {formData.description || 'Descrição do produto'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddProductPage;
