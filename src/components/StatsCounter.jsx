import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Star, Download } from 'lucide-react';

const StatsCounter = () => {
  const [counts, setCounts] = useState({
    teachers: 0,
    materials: 0,
    rating: 0,
    downloads: 0
  });

  const finalCounts = {
    teachers: 2500,
    materials: 850,
    rating: 4.9,
    downloads: 15000
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const timer = setInterval(() => {
      setCounts(prev => ({
        teachers: Math.min(prev.teachers + Math.ceil(finalCounts.teachers / steps), finalCounts.teachers),
        materials: Math.min(prev.materials + Math.ceil(finalCounts.materials / steps), finalCounts.materials),
        rating: Math.min(prev.rating + (finalCounts.rating / steps), finalCounts.rating),
        downloads: Math.min(prev.downloads + Math.ceil(finalCounts.downloads / steps), finalCounts.downloads)
      }));
    }, stepDuration);

    setTimeout(() => clearInterval(timer), duration);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: Users,
      value: counts.teachers.toLocaleString(),
      label: 'Professores Atendidos',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BookOpen,
      value: counts.materials.toLocaleString(),
      label: 'Materiais Disponíveis',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Star,
      value: counts.rating.toFixed(1),
      label: 'Avaliação Média',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Download,
      value: counts.downloads.toLocaleString(),
      label: 'Downloads Realizados',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
        >
          <motion.div
            className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <stat.icon className="w-6 h-6 text-white" />
          </motion.div>
          <motion.div
            className="text-2xl font-bold text-gray-800 mb-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.7, type: "spring" }}
          >
            {stat.value}
          </motion.div>
          <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCounter;