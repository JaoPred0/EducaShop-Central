import React, { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import { useCart } from '../context/CartContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const brl = (n) => (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const genOrderId = () => 'PED-' + Math.random().toString(36).slice(2, 8).toUpperCase();

export default function CheckoutPagePDF() {
  const { cartItems, cartTotal } = useCart();
  const [orderId] = useState(genOrderId);
  const [customerName, setCustomerName] = useState(''); // nome do comprador

  const chavePix = '67996610494';
  const whatsapp = '5567996610494';

  const waText = useMemo(() => (
    [`NÚMERO do pedido: ${orderId}`, `Nome: ${customerName}`]
  ), [orderId, customerName]);

  const buildPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 40;
    let y = 60;

    doc.setFillColor(63, 81, 181);
    doc.rect(0, 0, 595, 60, 'F');
    doc.setTextColor(255, 255, 255).setFont('helvetica', 'bold').setFontSize(20);
    doc.text('EducaShop - Comprovante de Pedido', 300, 40, { align: 'center' });
    doc.setTextColor(0, 0, 0).setFont('helvetica', 'normal').setFontSize(11);
    y += 30; doc.text(`Pedido: ${orderId}`, marginX, y);
    y += 16; doc.text(`Nome: ${customerName}`, marginX, y); // mostra o nome
    y += 16; doc.text(`Data/Hora: ${new Date().toLocaleString('pt-BR')}`, marginX, y);

    y += 20; doc.setFont('helvetica', 'bold').setFontSize(13).text('Produtos', marginX, y);
    y += 14; doc.setFont('helvetica', 'normal').setFontSize(11);
    cartItems.forEach((item) => {
      doc.text(`${item.quantity}x ${item.name}`, marginX, y);
      doc.text(brl(item.price * item.quantity), 555, y, { align: 'right' });
      y += 16;
    });

    y += 10; doc.line(marginX, y, 555, y);
    y += 20; doc.setFont('helvetica', 'bold').text('Total', marginX, y);
    doc.text(brl(cartTotal), 555, y, { align: 'right' });

    y += 30;
    doc.setFont('helvetica', 'bold').setFontSize(14).setTextColor(63, 81, 181);
    doc.text('Informações de Pagamento (PIX)', marginX, y);
    y += 18; doc.setFont('helvetica', 'normal').setFontSize(12).setTextColor(0, 0, 0);
    doc.text(`Chave PIX: ${chavePix}`, marginX, y);

    y += 30;
    doc.setFont('helvetica', 'bold').setFontSize(13).setTextColor(0, 0, 0);
    doc.text('Instruções para Finalização', marginX, y);
    doc.setFont('helvetica', 'normal').setFontSize(11);

    y += 16;
    const wrap = (txt) => doc.splitTextToSize(txt, 515 - marginX);
    [
      `1) No WhatsApp, informe seu NOME e o NÚMERO do pedido: ${orderId}.`,
      '2) Você receberá os dados do comprovante do carrinho.',
      '3) Enviaremos as informações de pagamento via PIX.',
      '4) Efetue o pagamento e envie o comprovante via WhatsApp.',
      '5) Após validação, seu pedido será liberado e a confirmação enviada pelo WhatsApp.'
    ].forEach((s) => {
      wrap(s).forEach((line) => { doc.text(line, marginX, y); y += 14; });
      y += 4;
    });

    doc.setFontSize(9).setTextColor(100);
    doc.text('Obrigado por comprar na EducaShop!', 300, 820, { align: 'center' });

    return doc;
  };

  const openViewer = () => {
    const doc = buildPdf();
    const url = doc.output('dataurlstring');
    window.open(url, "_blank");
  };

  const downloadPdf = () => {
    const doc = buildPdf();
    doc.save(`${orderId} - comprovante.pdf`);
  };

  const handleRequestPayment = async () => {
    if (!customerName) return alert('Por favor, informe seu nome.');

    const doc = buildPdf();
    const pdfBase64 = doc.output('datauristring');

    try {
      await addDoc(collection(db, 'orders'), {
        orderId,
        customerName, // salva o nome
        items: cartItems,
        total: cartTotal,
        pdf: pdfBase64,
        status: 'Pendente',
        createdAt: serverTimestamp()
      });

      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(waText.join('\n'))}`, '_blank');
      alert('Pedido enviado ao dashboard e WhatsApp aberto para solicitar pagamento.');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar o pedido.');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Finalizar Pedido</h1>

      <div className="bg-white shadow rounded p-6 mb-6">
        <input
          type="text"
          placeholder="Seu nome completo"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border p-2 w-full rounded mb-4"
        />

        <h2 className="text-xl font-bold mb-4">Produtos</h2>
        {cartItems.map((i) => (
          <div key={i.id} className="flex justify-between py-1 text-sm">
            <span>{i.name} × {i.quantity}</span>
            <span>{brl(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t mt-3 pt-3 font-bold">
          <span>Total</span>
          <span>{brl(cartTotal)}</span>
        </div>
        <div className="mt-3 text-center">
          <span className="text-sm text-gray-600">
            Para saber mais, abra o PDF clicando no botão azul. Lá explica a forma de pagamento.
          </span>
        </div>
      </div>

      <div>
        <button onClick={downloadPdf} className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700">
          Baixar PDF
        </button>
      </div>

      <div className="mt-4">
        <button onClick={handleRequestPayment} className="w-full bg-emerald-600 text-white py-3 rounded font-bold hover:bg-emerald-700">
          Solicitar Pagamento (WhatsApp)
        </button>
      </div>
    </div>
  );
}
