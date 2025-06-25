import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";
import { Search } from 'lucide-react';

export default function Times() {
  const [times, setTimes] = useState([]);
  const [search, setSearch] = useState("");
  const [timeSelecionado, setTimeSelecionado] = useState(null);
  const [searchTime, setSearchTime] = useState("");
  const [searchPais, setSearchPais] = useState("");
  const [searchFundacao, setSearchFundacao] = useState("");

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await fetch("http://localhost:3333/team");
        const data = await res.json();
        setTimes(data);
      } catch (error) {
        console.error("Erro ao buscar os times:", error);
      }
    };

    fetchTimes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este time?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3333/team/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTimes((prevTimes) => prevTimes.filter((time) => time.id !== id));
      } else {
        alert("Erro ao excluir o time");
      }
    } catch (error) {
      console.error("Erro ao excluir o time:", error);
      alert("Erro ao excluir o time");
    }
  };

  // Pesquisa
    useEffect(() => {
      if (search.trim() === "") {
        setTimeSelecionado([]); // Limpa os resultados se a busca estiver vazia
        return;
      }
  
      const fetchJogadores = async () => {
        try {
          const res = await fetch(`http://localhost:3333/team?q=${encodeURIComponent(search)}`);
          const data = await res.json();
          setTimeSelecionado(data);
        } catch (error) {
          console.error("Erro ao buscar os jogadores:", error);
        }
      };
  
      fetchJogadores();
    }, [search]);

    useEffect(() => {
      // Se todos os filtros estiverem vazios, limpa o filtro
      if (
        searchTime.trim() === "" &&
        searchPais.trim() === "" &&
        searchFundacao.trim() === ""
      ) {
        setTimeSelecionado([]);
        return;
      }
  
      const params = new URLSearchParams();
      if (searchTime.trim() !== "") params.append("q", searchTime);
      if (searchPais.trim() !== "") params.append("country", searchPais);
      if (searchFundacao.trim() !== "") params.append("foundation", searchFundacao);
  
      const fetchTimes = async () => {
        try {
          const res = await fetch(`http://localhost:3333/team?${params.toString()}`);
          const data = await res.json();
          setTimeSelecionado(data);
        } catch (error) {
          console.error("Erro ao buscar os times:", error);
        }
      };
  
      fetchTimes();
    }, [searchTime, searchPais, searchFundacao]);

  return (
    <div className="flex flex-col items-center justify-center w-[95%] bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-3xl text-white font-bold">TIMES</h1>
          <a
            href="/times/criar"
            className="bg-white text-black px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faAdd} />
            <p className="font-bold">Adicionar Time</p>
          </a>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left whitespace-nowrap">
                <div>
                  <p className="w-50 text-center mb-1">Nome</p>
                  <input 
                    type="text"
                    value={searchTime} 
                    placeholder="Pesquisar Time 🔎"
                    onChange={(e) => setSearchTime(e.target.value)}
                    className="bg-white rounded-lg w-50 text-black placeholder-black text-center py-1 focus:outline-none focus:shadow-outline"
                  /> 
                </div>
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                <div>
                  <p className="w-50 text-center mb-1">País</p>
                  <input 
                    type="text"
                    value={searchPais} 
                    placeholder="Pesquisar País 🔎"
                    onChange={(e) => setSearchPais(e.target.value)}
                    className="bg-white rounded-lg w-50 text-black placeholder-black text-center py-1 focus:outline-none focus:shadow-outline"
                  /> 
                </div>
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                <div>
                  <p className="w-full text-center mb-1">Fundação</p>
                  <input 
                    type="date"
                    value={searchFundacao}
                    onChange={(e) => setSearchFundacao(e.target.value)}
                    className="bg-white rounded-lg w-full text-black placeholder-black flex justify-center py-1 focus:outline-none focus:shadow-outline"
                  /> 
                </div>
              </th>
              <th className="py-3 px-6 text-right whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(searchTime || searchPais || searchFundacao ? timeSelecionado : times).map((time) => (
                <tr
                  key={time.id}
                  className="border-b text-black border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-1 px-6 text-left whitespace-nowrap">{time.name}</td>
                  <td className="py-1 px-6 text-left whitespace-nowrap">{time.country}</td>
                  <td className="py-1 px-6 text-left whitespace-nowrap">
                    {new Date(time.foundation).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-1 px-6 text-right whitespace-nowrap">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 mr-2"
                      onClick={() => handleDelete(time.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <a
                      className="bg-blue-500 text-white px-4 py-[6px] rounded hover:bg-blue-700 transition-colors duration-300"
                      href={`/times/editar/${time.id}`}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
