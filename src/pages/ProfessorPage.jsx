// ProfessorPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { categoriesProfessor } from "../data/categoriesProfessor";

const ProfessorPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Área do Professor
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

      {/* Categorias */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {categoriesProfessor.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold py-6 px-6 rounded-xl text-center shadow-md transition-all duration-300"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfessorPage;
