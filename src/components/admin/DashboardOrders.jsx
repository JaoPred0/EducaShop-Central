import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle, XCircle, Download, ShoppingCart, User, Tag, DollarSign, List } from 'lucide-react';
import { db } from '../../firebase/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf'; // Importar jsPDF aqui também

// Função brl movida para fora do componente para ser acessível globalmente no arquivo
const brl = (n) =>
  (Number(n) || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);

  const handleRemoveOrder = async (orderId) => {
    if (!window.confirm('Deseja realmente remover este pedido?')) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      alert('Pedido removido com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao remover o pedido.');
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const buildPdf = (order) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 40;
    let y = 60;

    // Cores da logo (roxo e azul)
    const primaryColor = [102, 51, 153]; // Roxo
    const secondaryColor = [0, 153, 204]; // Azul
    const textColor = [50, 50, 50]; // Cinza escuro para o texto principal

    // Cabeçalho com cores da logo e nome da loja
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 595, 80, 'F'); 
    
    const logoBase64 = 'https://utfs.io/f/2vMRHqOYUHc0iYIjdDU3SvywDhA4KtNVCgeG7fQn92ZEUMjC'; 
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', marginX, 15, 50, 50); 
    }

    doc.setTextColor(255, 255, 255)
      .setFont('helvetica', 'bold')
      .setFontSize(24); 
    doc.text('EducaShop Central', 300, 45, { align: 'center' }); 

    doc.setFontSize(16);
    doc.text('Comprovante de Pedido', 300, 65, { align: 'center' }); 

    // Dados básicos do pedido
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
      .setFont('helvetica', 'normal')
      .setFontSize(11);
    y = 100; 
    doc.text(`Pedido ID: ${order.orderId}`, marginX, y);
    y += 16;
    doc.text(`Nome do Cliente: ${order.customerName}`, marginX, y);
    y += 16;
    doc.text(`Data/Hora do Pedido: ${order.createdAt ? new Date(order.createdAt.toDate()).toLocaleString('pt-BR') : 'N/A'}`, marginX, y);
    y += 16;
    doc.text(`Status do Pedido: ${order.status}`, marginX, y); // Detalhe adicional

    // Seção de Produtos
    y += 30;
    doc.setFont('helvetica', 'bold').setFontSize(14).text('Detalhes dos Produtos', marginX, y);
    y += 18;

    // Tabela de produtos
    doc.setFont('helvetica', 'bold').setFontSize(10);
    doc.text('Produto', marginX + 10, y);
    doc.text('Qtd', 350, y, { align: 'center' });
    doc.text('Preço Unit.', 450, y, { align: 'center' });
    doc.text('Subtotal', 555, y, { align: 'right' });
    y += 5;
    doc.line(marginX, y, 555, y); // Linha separadora
    y += 15;

    doc.setFont('helvetica', 'normal').setFontSize(10);
    order.items.forEach((item) => {
      doc.text(item.name, marginX + 10, y);
      doc.text(item.quantity.toString(), 350, y, { align: 'center' });
      doc.text(brl(item.price), 450, y, { align: 'center' });
      doc.text(brl(item.price * item.quantity), 555, y, { align: 'right' });
      y += 16;
    });

    // Total
    y += 10;
    doc.line(marginX, y, 555, y);
    y += 20;
    doc.setFont('helvetica', 'bold').setFontSize(14).text('Total do Pedido', marginX, y);
    doc.text(brl(order.total), 555, y, { align: 'right' });

    // Seção de Pagamento
    y += 30;
    doc.setFont('helvetica', 'bold')
      .setFontSize(14)
      .setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); 
    doc.text('Informações de Pagamento (PIX)', marginX, y);
    y += 18;
    doc.setFont('helvetica', 'normal')
      .setFontSize(12)
      .setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`Chave PIX: 67996610494`, marginX, y); // Chave PIX fixa
    y += 16;
    doc.text(`Tipo de Pagamento: PIX - Chave Aleatória`, marginX, y); // Detalhe adicional

    // Instruções para Finalização
    y += 30;
    doc.setFont('helvetica', 'bold')
      .setFontSize(13)
      .setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('Instruções para Finalização', marginX, y);
    doc.setFont('helvetica', 'normal').setFontSize(11);

    y += 16;
    const wrap = (txt) => doc.splitTextToSize(txt, 515 - marginX);
    [
      `1) No WhatsApp, informe seu NOME completo e o NÚMERO do pedido: ${order.orderId}.`,
      '2) Você receberá os dados do comprovante do carrinho e a confirmação dos itens.',
      '3) Enviaremos as informações de pagamento via PIX, incluindo um QR Code para facilitar.',
      '4) Efetue o pagamento e envie o comprovante de transação via WhatsApp para validação.',
      '5) Após a validação do pagamento, seu pedido será liberado e a confirmação final enviada pelo WhatsApp.',
      '6) Em caso de dúvidas ou problemas, entre em contato conosco pelo WhatsApp.', 
    ].forEach((s) => {
      wrap(s).forEach((line) => {
        doc.text(line, marginX, y);
        y += 14;
      });
      y += 4;
    });

    // Rodapé com informações de contato e agradecimento
    doc.setFontSize(9).setTextColor(100);
    doc.text('Obrigado por comprar na EducaShop Central!', 300, 800, { align: 'center' });
    doc.text(`Contato: WhatsApp 5567996610494 | Email: educashopcentral@gmail.com`, 300, 815, { align: 'center' });

    return doc;
  };

  const downloadPdf = (order) => {
    const doc = buildPdf(order);
    doc.save(`${order.orderId} - comprovante.pdf`);
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
                        onClick={() => downloadPdf(order)} // Passa o objeto order completo
                        className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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
                      <motion.button
                        onClick={() => handleRemoveOrder(order.id)}
                        className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <XCircle className="w-5 h-5" />
                        Remover Pedido
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