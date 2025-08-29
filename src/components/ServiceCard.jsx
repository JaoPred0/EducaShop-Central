import React from 'react';
import { motion } from 'framer-motion';

const ServiceCard = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
    >
      <motion.div
        className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <service.icon className="w-7 h-7 text-white" />
      </motion.div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
      <p className="text-gray-600 leading-relaxed mb-4">{service.description}</p>
      
      <div className="space-y-2">
        {service.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            {feature}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ServiceCard;