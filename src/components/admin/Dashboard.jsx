import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Calendar } from 'lucide-react';
import StatsCard from './StatsCard';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const DashboardAdmin = () => {
  return (
    <motion.div 
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral das suas vendas e métricas</p>
        </div>
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="text-blue-700 font-medium">Hoje</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Receita Total"
          // value={formatCurrency(totalRevenue)}
          change={12.5}
          icon={DollarSign}
          color="green"
          index={0}
        />
        <StatsCard
          title="Total de Pedidos"
          // value={formatNumber(totalOrders)}
          change={8.2}
          icon={ShoppingCart}
          color="blue"
          index={1}
        />
        <StatsCard
          title="Produtos Ativos"
          // value={formatNumber(totalProducts)}
          change={-2.1}
          icon={Package}
          color="purple"
          index={2}
        />
        <StatsCard
          title="Clientes Ativos"
          // value={formatNumber(totalCustomers)}
          change={15.3}
          icon={Users}
          color="orange"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">Vendas Mensais</h2>
          </div>
          
          <div className="space-y-4">
            {/* {monthlyData.slice(-3).map((month, index) => (
              <div key={month.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{month.month}</p>
                  <p className="text-sm text-gray-600">{month.orders} pedidos</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">{formatCurrency(month.sales)}</p>
                  <div className="w-24 h-2 bg-gray-200 rounded-full mt-2">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      style={{ width: `${(month.sales / 70000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))} */}
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900">Vendas Recentes</h2>
          </div>
          
          <div className="space-y-4">
            {/* {recentSales.map((sale, index) => (
              <motion.div 
                key={sale.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div>
                  <p className="font-semibold text-gray-900">{sale.customerName}</p>
                  <p className="text-sm text-gray-600">{sale.products.length} produto(s)</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatCurrency(sale.total)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    sale.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {sale.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </span>
                </div>
              </motion.div>
            ))} */}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardAdmin;