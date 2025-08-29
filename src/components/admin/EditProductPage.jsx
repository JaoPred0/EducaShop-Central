import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    discount: '',
    description: '',
    images: [],
    offer: false,
  });

  const [imageInput, setImageInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || '',
            price: data.price || '',
            category: data.category || '',
            discount: data.discount || '',
            description: data.description || '',
            images: data.images || [],
            offer: data.offer || false,
          });
        } else {
          console.log('Produto não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddImage = () => {
    if (!imageInput) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageInput]
    }));
    setImageInput('');
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        ...formData,
        price: parseFloat(formData.price),
        discount: formData.discount ? parseFloat(formData.discount) : 0,
      });
      alert('Produto atualizado!');
      navigate('/products');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10">
      {/* Formulário */}
      <motion.div
        className="flex-1 bg-white p-6 rounded-2xl shadow-lg"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="text-2xl font-bold mb-6">Editar Produto</h2>

        <div className="flex flex-col gap-4">
          <input type="text" name="name" placeholder="Nome" value={formData.name} onChange={handleChange} className="px-4 py-3 border rounded-lg" />
          <input type="number" name="price" placeholder="Preço" value={formData.price} onChange={handleChange} className="px-4 py-3 border rounded-lg" />
          <input type="number" name="discount" placeholder="Desconto (%)" value={formData.discount} onChange={handleChange} className="px-4 py-3 border rounded-lg" />
          <input type="text" name="category" placeholder="Categoria" value={formData.category} onChange={handleChange} className="px-4 py-3 border rounded-lg" />
          <textarea name="description" placeholder="Descrição" value={formData.description} onChange={handleChange} className="px-4 py-3 border rounded-lg resize-none" />

          {/* Input das imagens */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="URL da imagem (https://...)" 
              value={imageInput} 
              onChange={(e) => setImageInput(e.target.value)} 
              className="px-4 py-3 border rounded-lg flex-1" 
            />
            <button 
              type="button"
              onClick={handleAddImage} 
              className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600"
            >
              Adicionar
            </button>
          </div>

          {/* Lista de imagens */}
          {formData.images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20">
                  <img src={img} alt={`Imagem ${idx}`} className="w-20 h-20 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center gap-2">
            <input type="checkbox" name="offer" checked={formData.offer} onChange={handleChange} className="h-4 w-4" />
            Produto em Oferta
          </label>
          <button onClick={handleUpdate} className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors">
            Salvar Alterações
          </button>
        </div>
      </motion.div>

      {/* Preview do Card */}
      <motion.div className="flex-1 flex justify-center items-start" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-80">
          {formData.images.length > 0 ? (
            <img src={formData.images[0]} alt={formData.name} className="w-full h-48 object-cover" />
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

export default EditProductPage;
