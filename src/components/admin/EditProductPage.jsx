import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditProductPage = () => {
  const { id } = useParams(); // pega o id da URL
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct(data);
          setName(data.name);
          setPrice(data.price);
          setCategory(data.category);
          setDescription(data.description);
        } else {
          console.log('Produto não encontrado');
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, { name, price, category, description });
      alert('Produto atualizado!');
      navigate('/products');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Editar Produto</h1>
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="number"
        placeholder="Preço"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Salvar
      </button>
    </div>
  );
};

export default EditProductPage;
