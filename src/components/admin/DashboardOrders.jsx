import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle, XCircle, Download, ShoppingCart, User, Tag, DollarSign, List } from 'lucide-react';
import { db } from '../../firebase/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Se você tiver o Firebase configurado, descomente e use o código abaixo:
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();

    // Enquanto isso, para que o design apareça, vamos usar um array vazio.
    // Quando você conectar seu Firebase, ele vai preencher isso automaticamente.
    setOrders([]);
  }, []);

  const downloadPdf = (pdfBase64, orderId) => {
    if (!pdfBase64) {
      alert('PDF não disponível para este pedido.');
      return;
    }
    const link = document.createElement('a');
    link.href = pdfBase64;
    link.download = `${orderId} - comprovante.pdf`;
    link.click();
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Concluído':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Concluído':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'Pendente':
        return <Package className="w-4 h-4 mr-1" />;
      case 'Cancelado':
        return <XCircle className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };
  const handleFinalizeOrder = async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'Concluído' });
      alert('Pedido finalizado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao finalizar o pedido.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-4xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Pedidos Mágicos
          </h1>
        </div>

        <AnimatePresence>
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 text-center shadow-xl"
            >
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              >
                <Package className="w-12 h-12 text-blue-500" />
              </motion.div>
              <motion.h3
                className="text-2xl font-bold text-gray-800 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Nenhum pedido encontrado!
              </motion.h3>
              <motion.p
                className="text-gray-500 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Parece que a loja está um pouco parada. Que tal fazer umas vendas?
              </motion.p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      <p className="flex items-center text-gray-700 font-medium">
                        <User className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-semibold text-gray-900">{order.customerName || 'Cliente Desconhecido'}</span>
                      </p>
                      <p className="flex items-center text-gray-700">
                        <Tag className="w-4 h-4 mr-2 text-purple-500" />
                        <span className="font-semibold text-gray-900">{order.orderId || 'N/A'}</span>
                      </p>
                      <p className="flex items-center text-gray-700">
                        <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-semibold text-gray-900">R$ {order.total ? order.total.toFixed(2) : '0.00'}</span>
                      </p>
                      <p className="flex items-center text-gray-700 col-span-full sm:col-span-1">
                        <List className="w-4 h-4 mr-2 text-orange-500" />
                        <span className="text-sm text-gray-600">
                          {order.items && order.items.length > 0
                            ? order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')
                            : 'Nenhum item'}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 mt-4 md:mt-0">
                      <motion.span
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusClasses(order.status)}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {getStatusIcon(order.status)}
                        {order.status || 'Desconhecido'}
                      </motion.span>
                      <motion.button
                        onClick={() => downloadPdf(order.pdf, order.orderId)}
                        className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!order.pdf}
                      >
                        <Download className="w-5 h-5" />
                        Baixar PDF
                      </motion.button>
                      <motion.button
                        onClick={() => handleFinalizeOrder(order.id)}
                        className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={order.status === 'Concluído' || order.status === 'Cancelado'}
                      >
                        <CheckCircle className="w-5 h-5" />
                        Finalizar Pedido
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}