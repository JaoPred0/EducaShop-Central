import React, { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import { useCart } from '../context/CartContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

const brl = (n) =>
  (Number(n) || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const genOrderId = () =>
  'PED-' + Math.random().toString(36).slice(2, 8).toUpperCase();

export default function CheckoutPagePDF() {
  const location = useLocation();
  const navigate = useNavigate();
  const productFromBuyNow = location.state?.product || null;

  const { cartItems, cartTotal } = useCart();
  const [orderId] = useState(genOrderId);
  const [customerName, setCustomerName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const items = productFromBuyNow
    ? [{ ...productFromBuyNow, quantity: 1 }]
    : cartItems;

  const total = productFromBuyNow
    ? productFromBuyNow.price
    : cartTotal;

  const chavePix = '67996610494';
  const whatsapp = '5567996610494';

  const waText = useMemo(
    () => [
      `NÚMERO do pedido: ${orderId}`,
      `Nome: ${customerName}`,
      `Total: ${brl(total)}`
    ],
    [orderId, customerName, total]
  );

  const buildPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 40;
    let y = 60;

    // Cores da logo (roxo e azul)
    const primaryColor = [102, 51, 153]; // Roxo
    const secondaryColor = [0, 153, 204]; // Azul
    const textColor = [50, 50, 50]; // Cinza escuro para o texto principal

    // Adicionar uma fonte mais moderna (ex: Open Sans ou Lato - precisa ser adicionada ao jsPDF)
    // Para usar fontes personalizadas, você precisa carregar os arquivos .ttf e usar doc.addFont()
    // Por simplicidade, vou usar uma das fontes padrão do jsPDF que pareça mais "moderna"
    // 'helvetica' é uma boa opção, mas 'times' ou 'courier' também estão disponíveis.
    // Para uma fonte realmente personalizada, você precisaria de algo como:
    // doc.addFont('path/to/OpenSans-Regular.ttf', 'OpenSans', 'normal');
    // doc.setFont('OpenSans', 'normal');
    // Por enquanto, vamos manter 'helvetica' e focar nos outros detalhes.

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
    doc.text(`Pedido ID: ${orderId}`, marginX, y);
    y += 16;
    doc.text(`Nome do Cliente: ${customerName}`, marginX, y);
    y += 16;
    doc.text(`Data/Hora do Pedido: ${new Date().toLocaleString('pt-BR')}`, marginX, y);
    y += 16;
    doc.text(`Status do Pedido: Pendente de Pagamento`, marginX, y); // Detalhe adicional

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
    items.forEach((item) => {
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
    doc.text(brl(total), 555, y, { align: 'right' });

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
    doc.text(`Chave PIX: ${chavePix}`, marginX, y);
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
      `1) No WhatsApp, informe seu NOME completo e o NÚMERO do pedido: ${orderId}.`,
      '2) Você receberá os dados do comprovante do carrinho e a confirmação dos itens.',
      '3) Enviaremos as informações de pagamento via PIX, incluindo um QR Code para facilitar.',
      '4) Efetue o pagamento e envie o comprovante de transação via WhatsApp para validação.',
      '5) Após a validação do pagamento, seu pedido será liberado e a confirmação final enviada pelo WhatsApp.',
      '6) Em caso de dúvidas ou problemas, entre em contato conosco pelo WhatsApp.', // Detalhe adicional
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
    doc.text(`Contato: WhatsApp ${whatsapp} | Email: educashopcentral@gmail.com`, 300, 815, { align: 'center' });

    return doc;
  };
  const [isWaiting, setIsWaiting] = useState(false);

  const downloadPdf = () => {
    const doc = buildPdf();
    doc.save(`${orderId} - comprovante.pdf`);
  };

  const handleRequestPayment = async () => {
    if (isWaiting) return; // Bloqueia se estiver no cooldown

    if (!customerName.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsWaiting(true); // Ativa cooldown
    setTimeout(() => setIsWaiting(false), 15000); // 15 segundos

    const doc = buildPdf();
    const pdfBase64 = doc.output('datauristring');

    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        orderId,
        customerName,
        items,
        total,
        pdf: pdfBase64,
        status: 'Pendente',
        createdAt: serverTimestamp(),
      });

      navigate(`/aguardando/${docRef.id}`, { state: { whatsapp, waText: waText.join('\n') } });
    } catch (error) {
      console.error(error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
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
            disabled={isWaiting}
            className={`w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300
    ${isWaiting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl'
              }`}
            whileHover={!isWaiting ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isWaiting ? { scale: 0.98 } : {}}
          >
            <MessageSquare className="w-6 h-6" />
            {isWaiting ? 'Aguarde 15s...' : 'Solicitar Pagamento (WhatsApp)'}
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