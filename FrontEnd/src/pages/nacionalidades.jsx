import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";

export default function Nacionalidades() {
  const [nacionalidades, setNacionalidades] = useState([]);
  const [searchNome, setSearchNome] = useState("");

  useEffect(() => {
    async function fetchNacionalidades() {
      try {
        const res = await fetch("http://localhost:3333/nacionalidades");
        if (!res.ok) throw new Error("Erro ao buscar nacionalidades");
        const data = await res.json();
        setNacionalidades(data);
      } catch (error) {
        alert(error.message);
      }
    }
    fetchNacionalidades();
  }, []);

  const listaFiltrada = nacionalidades.filter((n) =>
    n.nome.toLowerCase().includes(searchNome.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta nacionalidade?")) return;

    try {
      const response = await fetch(`http://localhost:3333/nacionalidades/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNacionalidades((prev) => prev.filter((n) => n.id !== id));
      } else {
        alert("Erro ao excluir a nacionalidade");
      }
    } catch (error) {
      alert("Erro ao excluir a nacionalidade");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-[95%] bg-blue-400 p-8 rounded-lg shadow-lg mt-10">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-3xl text-white font-bold">NACIONALIDADES</h1>
        <Link
          to="/nacionalidades/criar"
          className="bg-white text-black px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faAdd} />
          <p className="font-bold">Adicionar Nacionalidade</p>
        </Link>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">Nome</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
            <tr className="bg-gray-200">
              <th className="py-2 px-6 text-center">
                <input
                  type="text"
                  value={searchNome}
                  placeholder="Pesquisar Nacionalidade 🔎"
                  onChange={(e) => setSearchNome(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full !text-black placeholder-black text-center py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-4 px-6 text-center text-gray-500 font-semibold bg-gray-50">
                  Nenhuma nacionalidade encontrada.
                </td>
              </tr>
            ) : (
              listaFiltrada.map((nacionalidade) => (
                <tr
                  key={nacionalidade.id}
                  className="border-b text-black border-gray-200 hover:bg-blue-100 transition-colors duration-200"
                >
                  <td className="py-2 px-6 text-center whitespace-nowrap font-medium">{nacionalidade.nome}</td>
                  <td className="py-2 px-6 text-center whitespace-nowrap flex justify-center gap-2">
                    <button
                      onClick={() => handleDelete(nacionalidade.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 shadow-md hover:scale-105"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <Link
                      to={`/nacionalidades/editar/${nacionalidade.id}`}
                      className="bg-blue-500 text-white px-4 py-[6px] rounded hover:bg-blue-700 transition-colors duration-300 shadow-md hover:scale-105 flex items-center gap-1"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
