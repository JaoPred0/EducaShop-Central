import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardAdmin from '../../components/admin/Dashboard';
import ProductManager from '../../components/admin/ProductManager';
import Analytics from '../../components/admin/Analytics';
import Sidebar from '../../components/admin/Sidebar';
import CustomerManager from '../../components/admin/CustomerManager';
import DashboardOrders from '../../components/admin/DashboardOrders';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardAdmin />;
      case 'products':
        return <ProductManager />;
      case 'customers':
        return <CustomerManager />;
      case 'analytics':
        return <Analytics />;
      case 'pedidos':
        return <DashboardOrders />;
      default:
        return <DashboardAdmin />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <motion.main
        className="flex-1 overflow-auto"
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.main>
    </div>
  );
};

export default Dashboard;