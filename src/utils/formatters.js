export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const getStatusColor = (status) => {
  const colors = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    active: 'bg-blue-100 text-blue-800 border-blue-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    low_stock: 'bg-orange-100 text-orange-800 border-orange-200',
    vip: 'bg-purple-100 text-purple-800 border-purple-200'
  };
  return colors[status] || colors.active;
};

export const calculateGrowth = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};