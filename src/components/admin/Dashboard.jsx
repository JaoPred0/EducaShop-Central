// src/pages/admin/DashboardCompleto.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, Package, Calendar, TrendingUp } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Card de métricas
const StatsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div className="p-6 rounded-xl shadow-lg bg-white border border-gray-200 flex items-center gap-4" whileHover={{ scale: 1.05 }}>
    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </motion.div>
);

// Gráfico de receita anual por mês
const RevenueChart = ({ monthlyRevenue }) => {
  const chartData = {
    labels: Object.keys(monthlyRevenue),
    datasets: [
      {
        label: 'Receita',
        data: Object.values(monthlyRevenue),
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.3)',
        tension: 0.4
      }
    ]
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, title: { display: true, text: 'Receita por Mês' } }
  };
  return <div className="bg-white p-6 rounded-xl shadow-lg"><Line data={chartData} options={chartOptions} /></div>;
};

// Gráfico de pedidos por dia do mês
const OrdersPerDayChart = ({ dailyOrders }) => {
  const chartData = {
    labels: Object.keys(dailyOrders),
    datasets: [
      {
        label: 'Pedidos',
        data: Object.values(dailyOrders),
        backgroundColor: 'rgba(16, 185, 129, 0.7)' // verde
      }
    ]
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, title: { display: true, text: 'Pedidos por Dia (Mês Atual)' } }
  };
  return <div className="bg-white p-6 rounded-xl shadow-lg"><Bar data={chartData} options={chartOptions} /></div>;
};

// Pedidos recentes
const RecentOrders = ({ orders }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
    <h2 className="text-lg font-bold mb-4">Pedidos Recentes</h2>
    {orders.map(order => (
      <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
        <p>{order.customerName}</p>
        <p className="font-semibold">R$ {order.total.toFixed(2)}</p>
        <span className={`px-3 py-1 rounded-full text-xs ${order.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {order.status}
        </span>
      </div>
    ))}
  </div>
);

// Notificações
const NotificationsCard = ({ notifications }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-lg font-bold mb-4">Notificações</h2>
    <ul className="space-y-2">
      {notifications.map((note, i) => (
        <li key={i} className="text-gray-600 text-sm">{note}</li>
      ))}
    </ul>
  </div>
);

const DashboardCompleto = () => {
  const [orders, setOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState({});
  const [dailyOrders, setDailyOrders] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    // Pedidos do Firebase
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snapshot => {
      const completedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(order => order.status === 'Concluído');

      setOrders(completedOrders.slice(0, 5));

      // Total ganho
      setTotalRevenue(completedOrders.reduce((acc, order) => acc + order.total, 0));

      // Receita por mês
      const revenueByMonth = {};
      const currentYear = new Date().getFullYear();
      completedOrders.forEach(order => {
        const date = new Date(order.createdAt?.toDate());
        if (date.getFullYear() === currentYear) {
          const month = date.toLocaleString('pt-BR', { month: 'short' });
          revenueByMonth[month] = (revenueByMonth[month] || 0) + order.total;
        }
      });
      setMonthlyRevenue(revenueByMonth);

      // Pedidos por dia no mês atual
      const daily = {};
      const currentMonth = new Date().getMonth();
      completedOrders.forEach(order => {
        const date = new Date(order.createdAt?.toDate());
        if (date.getMonth() === currentMonth) {
          const day = date.getDate();
          daily[day] = (daily[day] || 0) + 1;
        }
      });
      setDailyOrders(daily);
    });

    // Produtos
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      setTotalProducts(snapshot.size);
    };
    fetchProducts();

    return () => unsub();
  }, []);

  const notifications = orders.map(order => `Pedido ${order.id} finalizado por R$ ${order.total.toFixed(2)}`);

  return (
    <motion.div className="p-6 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Completo</h1>
          <p className="text-gray-600 mt-1">Visão geral das vendas e métricas</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Receita Total" value={`R$ ${totalRevenue.toFixed(2)}`} icon={DollarSign} color="green" />
        <StatsCard title="Total de Pedidos" value={orders.length} icon={ShoppingCart} color="blue" />
        <StatsCard title="Produtos na Loja" value={totalProducts} icon={Package} color="purple" />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart monthlyRevenue={monthlyRevenue} />
        <OrdersPerDayChart dailyOrders={dailyOrders} />
      </div>

      {/* Pedidos recentes e notificações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={orders} />
        <NotificationsCard notifications={notifications} />
      </div>
    </motion.div>
  );
};

export default DashboardCompleto;
