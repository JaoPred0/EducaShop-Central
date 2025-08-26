import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Phone, Edit, Trash2, Crown, UserCheck } from 'lucide-react';
import { db, auth } from '../../firebase/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';

const CustomerManager = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar usuários do Firestore
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(usersData);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  // Deletar usuário do Firestore
  const handleDeleteCustomer = async (customerId) => {
    try {
      await deleteDoc(doc(db, 'users', customerId));
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  // Filtrar por busca
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div className="p-6 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="text-gray-600 mt-1">Lista de todos que já fizeram login</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <UserCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
          />
        </div>
      </div>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{customer.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{customer.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        customer.loginMethod === 'google' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {customer.loginMethod === 'google' ? 'Google' : 'Email'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{customer.phone || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    Último Login: {customer.lastLogin?.seconds ? format(new Date(customer.lastLogin.seconds * 1000), 'dd/MM/yyyy HH:mm') : '-'}
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit className="w-4 h-4" /> Editar
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filteredCustomers.length === 0 && !loading && (
        <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum usuário encontrado</h3>
          <p className="text-gray-500">Tente ajustar a busca ou aguarde novos logins.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CustomerManager;
