// AlunoPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { categoriesAlunos } from "../data/categoriesAlunos";

const AlunoPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Área do Estudante
      </h2>
      {/* Botão de voltar */}
      <div className="mb-6 text-center">
        <Link
          to="/"
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-300"
        >
          ← Voltar
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categoriesAlunos.map(cat => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-6 px-6 rounded-xl text-center shadow-md transition-all duration-300"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AlunoPage;
