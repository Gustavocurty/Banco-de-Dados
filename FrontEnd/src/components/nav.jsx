import React from 'react';


export default function Nav() {
  return (
    <nav className="bg-blue-500 p-4 shadow-md fixed top-0 left-0 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold"><a href="/">Gestão de Jogadores de Futebol</a></div>
        <div className="flex space-x-10">
          <a href="/jogadores" className="text-white hover:text-blue-200">Jogadores</a>
          <a href="/times" className="text-white hover:text-blue-200">Times</a>
          <a href="/estatisticas" className="text-white hover:text-blue-200">Estatísticas</a>
          <a href="/contratos" className="text-white hover:text-blue-200">Contratos</a>
        </div>
      </div>
    </nav>
  );
}