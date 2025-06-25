import React from "react";
import { Link } from "react-router-dom";

export default function Nav() {

  return (
    <nav className="bg-blue-500 p-4 shadow-md fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/">Gestão de Jogadores de Futebol</Link>
        </div>

        <div className="flex space-x-10">
          <Link to="/jogadores" className="text-white hover:text-blue-200">
            Jogadores
          </Link>
          <Link to="/times" className="text-white hover:text-blue-200">
            Times
          </Link>
          <Link to="/estatisticas" className="text-white hover:text-blue-200">
            Estatísticas
          </Link>
          <Link to="/contratos" className="text-white hover:text-blue-200">
            Contratos
          </Link>
        </div>
      </div>
    </nav>
  );
}
