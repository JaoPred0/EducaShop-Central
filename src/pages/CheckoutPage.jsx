import React, { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import { useCart } from '../context/CartContext'; // Mantenha se estiver usando CartContext
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Mantenha se estiver usando Firebase
import { db } from '../firebase/firebase'; // Mantenha se estiver usando Firebase
import { useLocation, useNavigate } from 'react-router-dom'; // Adicionado useNavigate
import { motion } from 'framer-motion'; // Para as animações
import { Download, MessageSquare, CheckCircle, XCircle } from 'lucide-react'; // Ícones Lucide

const brl = (n) =>
  (Number(n) || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const genOrderId = () =>
  'PED-' + Math.random().toString(36).slice(2, 8).toUpperCase();

export default function CheckoutPagePDF() {
  const location = useLocation();
  const navigate = useNavigate(); // Inicializa useNavigate
  const productFromBuyNow = location.state?.product || null;

  // const { cartItems, cartTotal } = useCart(); // Descomente se estiver usando CartContext
  const [orderId] = useState(genOrderId);
  const [customerName, setCustomerName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Dados de mock para simular o carrinho/produto, já que não posso acessar seu Firebase/Context
  const mockCartItems = [
    { id: '1', name: 'Teclado Mecânico RGB Pro', price: 399.99, quantity: 1 },
    { id: '2', name: 'Mouse Gamer Ergonômico', price: 149.90, quantity: 2 },
  ];
  const mockCartTotal = mockCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Se veio de "Comprar Agora", usa só 1 produto
  const items = productFromBuyNow
    ? [{ ...productFromBuyNow, quantity: 1 }]
    : mockCartItems; // Usando mockCartItems
  const total = productFromBuyNow ? productFromBuyNow.price : mockCartTotal; // Usando mockCartTotal

  const chavePix = '67996610494';
  const whatsapp = '5567996610494';

  const waText = useMemo(
    () => [`NÚMERO do pedido: ${orderId}`, `Nome: ${customerName}`, `Total: ${brl(total)}`],
    [orderId, customerName, total]
  );

  const buildPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 40;
    let y = 60;

    // Cabeçalho
    doc.setFillColor(99, 102, 241); // Cor mais vibrante
    doc.rect(0, 0, 595, 60, 'F');
    doc.setTextColor(255, 255, 255)
      .setFont('helvetica', 'bold')
      .setFontSize(20);
    doc.text('EducaShop - Comprovante de Pedido', 300, 40, { align: 'center' });

    // Dados básicos
    doc.setTextColor(0, 0, 0)
      .setFont('helvetica', 'normal')
      .setFontSize(11);
    y += 30;
    doc.text(`Pedido: ${orderId}`, marginX, y);
    y += 16;
    doc.text(`Nome: ${customerName}`, marginX, y);
    y += 16;
    doc.text(`Data/Hora: ${new Date().toLocaleString('pt-BR')}`, marginX, y);

    // Produtos
    y += 20;
    doc.setFont('helvetica', 'bold').setFontSize(13).text('Produtos', marginX, y);
    y += 14;
    doc.setFont('helvetica', 'normal').setFontSize(11);
    items.forEach((item) => {
      doc.text(`${item.quantity}x ${item.name}`, marginX, y);
      doc.text(brl(item.price * item.quantity), 555, y, { align: 'right' });
      y += 16;
    });

    // Total
    y += 10;
    doc.line(marginX, y, 555, y);
    y += 20;
    doc.setFont('helvetica', 'bold').text('Total', marginX, y);
    doc.text(brl(total), 555, y, { align: 'right' });

    // Pagamento
    y += 30;
    doc.setFont('helvetica', 'bold')
      .setFontSize(14)
      .setTextColor(99, 102, 241); // Cor mais vibrante
    doc.text('Informações de Pagamento (PIX)', marginX, y);
    y += 18;
    doc.setFont('helvetica', 'normal')
      .setFontSize(12)
      .setTextColor(0, 0, 0);
    doc.text(`Chave PIX: ${chavePix}`, marginX, y);

    // Instruções
    y += 30;
    doc.setFont('helvetica', 'bold')
      .setFontSize(13)
      .setTextColor(0, 0, 0);
    doc.text('Instruções para Finalização', marginX, y);
    doc.setFont('helvetica', 'normal').setFontSize(11);

    y += 16;
    const wrap = (txt) => doc.splitTextToSize(txt, 515 - marginX);
    [
      `1) No WhatsApp, informe seu NOME e o NÚMERO do pedido: ${orderId}.`,
      '2) Você receberá os dados do comprovante do carrinho.',
      '3) Enviaremos as informações de pagamento via PIX.',
      '4) Efetue o pagamento e envie o comprovante via WhatsApp.',
      '5) Após validação, seu pedido será liberado e a confirmação enviada pelo WhatsApp.',
    ].forEach((s) => {
      wrap(s).forEach((line) => {
        doc.text(line, marginX, y);
        y += 14;
      });
      y += 4;
    });

    doc.setFontSize(9).setTextColor(100);
    doc.text('Obrigado por comprar na EducaShop!', 300, 820, {
      align: 'center',
    });

    return doc;
  };

  const downloadPdf = () => {
    const doc = buildPdf();
    doc.save(`${orderId} - comprovante.pdf`);
  };

  const handleRequestPayment = async () => {
    if (!customerName.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const doc = buildPdf();
    const pdfBase64 = doc.output('datauristring');

    try {
      await addDoc(collection(db, 'orders'), {
        orderId,
        customerName,
        items,
        total,
        pdf: pdfBase64,
        status: 'Pendente',
        createdAt: serverTimestamp(),
      });

      window.open(
        `https://wa.me/${whatsapp}?text=${encodeURIComponent(waText.join('\n'))}`,
        '_blank'
      );
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      // alert('Pedido enviado ao dashboard e WhatsApp aberto para solicitar pagamento.');
    } catch (error) {
      console.error(error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      // alert('Erro ao salvar o pedido.');
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 max-w-3xl w-full border border-indigo-200"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-indigo-800">
          Finalizar Pedido
        </h1>

        <div className="bg-indigo-50 rounded-2xl p-6 mb-6 shadow-inner border border-indigo-100">
          <motion.input
            type="text"
            placeholder="Seu nome completo (obrigatório)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border border-indigo-300 p-3 w-full rounded-xl mb-4 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
            whileFocus={{ scale: 1.01 }}
          />

          <h2 className="text-xl font-bold mb-4 text-indigo-700">Resumo do Pedido</h2>
          {items.map((i) => (
            <div key={i.id} className="flex justify-between py-2 border-b border-indigo-100 last:border-b-0 text-gray-700">
              <span className="font-medium">
                {i.name} <span className="text-sm text-gray-500">× {i.quantity}</span>
              </span>
              <span className="font-semibold">{brl(i.price * i.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between mt-4 pt-4 border-t-2 border-indigo-200 font-extrabold text-xl text-indigo-800">
            <span>Total</span>
            <span>{brl(total)}</span>
          </div>
        </div>

        <motion.div
          className="mt-3 text-center bg-yellow-50 rounded-xl p-4 shadow-sm border border-yellow-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="text-sm text-yellow-800 font-medium">
            Para saber mais sobre o pagamento, baixe o PDF. Lá tem todas as instruções!
          </span>
        </motion.div>

        <div className="mt-6 space-y-4">
          <motion.button
            onClick={downloadPdf}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-6 h-6" />
            Baixar Comprovante (PDF)
          </motion.button>

          <motion.button
            onClick={handleRequestPayment}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageSquare className="w-6 h-6" />
            Solicitar Pagamento (WhatsApp)
          </motion.button>
        </div>

        {showSuccess && (
          <motion.div
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <CheckCircle className="w-5 h-5" />
            Pedido enviado com sucesso!
          </motion.div>
        )}

        {showError && (
          <motion.div
            className="fixed bottom-8 right-8 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <XCircle className="w-5 h-5" />
            Por favor, preencha seu nome!
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}