import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";

export default function Player() {
  const [jogadores, setJogadores] = useState([]);
  const [times, setTimes] = useState([]);
  const [JogadoresSelecionados, setJogadoresSelecionados] = useState([]);
  const [searchJogador, setSearchJogador] = useState("");
  const [searchNacionalidade, setSearchNacionalidade] = useState("");
  const [searchDataNascimento, setSearchDataNascimento] = useState("");
  const [searchPosicao, setSearchPosicao] = useState("");
  const [searchTime, setSearchTime] = useState("");

  useEffect(() => {
    const fetchJogadores = async () => {
      try {
        const res = await fetch("http://localhost:3333/player");
        const data = await res.json();
        setJogadores(data);
      } catch (error) {
        console.error("Erro ao buscar os jogadores:", error);
      }
    };
    fetchJogadores();
  }, []);

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

  const getTeamName = (teamId) => {
    const team = times.find((t) => t.id === teamId);
    return team ? team.name : "Sem time";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este jogador?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3333/player/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setJogadores((prev) => prev.filter((jogador) => jogador.id !== id));
      } else {
        alert("Erro ao excluir o jogador");
      }
    } catch (error) {
      console.error("Erro ao excluir o jogador:", error);
      alert("Erro ao excluir o jogador");
    }
  };

  useEffect(() => {
    if (
      searchJogador.trim() === "" &&
      searchNacionalidade.trim() === "" &&
      searchDataNascimento.trim() === "" &&
      searchPosicao.trim() === "" &&
      searchTime === ""
    ) {
      setJogadoresSelecionados([]);
      return;
    }

    const params = new URLSearchParams();
    if (searchJogador.trim() !== "") params.append("q", searchJogador);
    if (searchNacionalidade.trim() !== "") params.append("nationality", searchNacionalidade);
    if (searchDataNascimento.trim() !== "") params.append("birthday", searchDataNascimento);
    if (searchPosicao.trim() !== "") params.append("position", searchPosicao);
    if (searchTime !== "") params.append("teamId", searchTime);

    const fetchJogadores = async () => {
      try {
        const res = await fetch(`http://localhost:3333/player?${params.toString()}`);
        const data = await res.json();
        setJogadoresSelecionados(data);
      } catch (error) {
        console.error("Erro ao buscar os jogadores:", error);
      }
    };

    fetchJogadores();
  }, [searchJogador, searchNacionalidade, searchDataNascimento, searchPosicao, searchTime]);

  return (
    <div className="flex flex-col items-center justify-center w-[95%] bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-3xl text-white font-bold">JOGADORES</h1>
        <a
            href="/jogadores/criar"
            className="bg-white text-black px-4 py-2 ml-3 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faAdd} />
            <p className="font-bold">Adicionar Jogador</p>
          </a>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">

              <th className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex flex-col justify-center items-start">
                  <p className="w-50 text-center mb-1">Nome</p>
                  <input 
                    type="text"
                    value={searchJogador} 
                    placeholder="Pesquisar Jogador 🔎"
                    onChange={(e) => setSearchJogador(e.target.value)}
                    className="bg-white rounded-lg w-50 text-black placeholder-black text-center py-1 focus:outline-none focus:shadow-outline"
                  />  
                </div>
              </th>

              <th className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex flex-col justify-center items-start">
                  <p className="w-50 text-center mb-1">Nacionalidade</p>
                  <input 
                    type="text"
                    value={searchNacionalidade} 
                    placeholder="Pesquisar Nascionalidade 🔎"
                    onChange={(e) => setSearchNacionalidade(e.target.value)}
                    className="bg-white rounded-lg w-50 text-black placeholder-black text-center py-1 focus:outline-none focus:shadow-outline"
                  />  
                </div>
              </th>

              <th className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex flex-col justify-center items-start">
                  <p className="w-full text-center mb-1">Data de Nascimento</p>
                  <input 
                    type="date"
                    value={searchDataNascimento}
                    onChange={(e) => setSearchDataNascimento(e.target.value)}
                    className="bg-white rounded-lg w-50 flex justify-center text-black placeholder-black text-center py-1 focus:outline-none focus:shadow-outline"
                  />

                </div>
              </th>

              <th className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex flex-col justify-center items-start">
                  <p className="w-full text-center mb-1">Posição</p>
                  <input 
                    type="text"
                    value={searchPosicao}
                    placeholder="Pesquisar Posição 🔎"
                    onChange={(e) => setSearchPosicao(e.target.value)}
                    className="bg-white rounded-lg w-50 text-black placeholder-black text-center py-1 focus:outline-none focus:shadow-outline"
                  />
                </div>
              </th>

              <th className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex flex-col justify-center items-start">
                  <p className="w-full text-center mb-1">Time</p>
                  <select
                    value={searchTime}
                    onChange={e => setSearchTime(e.target.value)}
                    className="bg-white rounded-lg w-50 text-black placeholder-black text-center py-1 focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Todos</option>
                    {times.map(time => (
                      <option key={time.id} value={time.id}>{time.name}</option>
                    ))}
                  </select>
                </div>
              </th>

              <th className="py-3 px-6 text-right whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(searchJogador || searchNacionalidade || searchDataNascimento || searchPosicao || searchTime ? JogadoresSelecionados : jogadores).map((jogador) => (
                <tr
                  key={jogador.id}
                  className="border-b text-black border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-1 px-6 text-left whitespace-nowrap">{jogador.name}</td>
                  <td className="py-1 px-6 text-left whitespace-nowrap">{jogador.nationality}</td>
                  <td className="py-1 px-6 text-left whitespace-nowrap">
                    {new Date(jogador.birthday).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-1 px-6 text-left whitespace-nowrap">{jogador.position}</td>
                  <td className="py-1 px-6 text-left whitespace-nowrap">{getTeamName(jogador.teamId)}</td>
                  <td className="py-1 px-6 text-right whitespace-nowrap">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 mr-2"
                      onClick={() => handleDelete(jogador.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <a
                      className="bg-blue-500 text-white px-4 py-[6px] rounded hover:bg-blue-700 transition-colors duration-300"
                      href={`/jogadores/editar/${jogador.id}`}
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
