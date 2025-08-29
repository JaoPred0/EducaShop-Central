import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Settings,
  Home
} from 'lucide-react';
import CartPage from '../../pages/CartPage';

const Sidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
    { id: 'home', label: 'Site', icon: Home, isHome: true },
  ];

  return (
    <motion.div
      className="w-64 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 h-screen sticky top-0 shadow-xl"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              SalesFlow
            </h1>
            <p className="text-xs text-gray-500">Dashboard de Vendas</p>
          </div>
        </motion.div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            const handleClick = () => {
              if (item.isHome) {
                window.location.pathname = '/'; // Vai para a raiz
              } else {
                onTabChange(item.id);
              }
            };

            return (
              <motion.button
                key={item.id}
                onClick={handleClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </motion.button>
            );
          })}
        </nav>

      </div>
    </motion.div>
  );
};

export default Sidebar;