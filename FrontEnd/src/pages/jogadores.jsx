import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";

import "react-datepicker/dist/react-datepicker.css";

registerLocale("ptBR", ptBR);

export default function Player() {
  const [jogadores, setJogadores] = useState([]);
  const [times, setTimes] = useState([]);
  const [JogadoresSelecionados, setJogadoresSelecionados] = useState([]);
  const [searchJogador, setSearchJogador] = useState("");
  const [searchNacionalidade, setSearchNacionalidade] = useState("");
  const [searchDataNascimento, setSearchDataNascimento] = useState(null);
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
    if (!window.confirm("Tem certeza que deseja excluir este jogador?")) return;

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
      !searchJogador && !searchNacionalidade &&
      !searchDataNascimento && !searchPosicao && !searchTime
    ) {
      setJogadoresSelecionados([]);
      return;
    }

    const params = new URLSearchParams();
    if (searchJogador) params.append("q", searchJogador);
    if (searchNacionalidade) params.append("nationality", searchNacionalidade);
    if (searchDataNascimento) params.append("birthday", searchDataNascimento.toISOString().split("T")[0]);
    if (searchPosicao) params.append("position", searchPosicao);
    if (searchTime) params.append("teamId", searchTime);

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

  const lista = (searchJogador || searchNacionalidade || searchDataNascimento || searchPosicao || searchTime)
    ? JogadoresSelecionados
    : jogadores;

  return (
    <div className="flex flex-col items-center justify-center w-[95%] bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-3xl text-white font-bold">JOGADORES</h1>
        <a
          href="/jogadores/criar"
          className="bg-white text-black px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faAdd} />
          <p className="font-bold">Adicionar Jogador</p>
        </a>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">Nome</th>
              <th className="py-3 px-6 text-center">Nacionalidade</th>
              <th className="py-3 px-6 text-center">Nascimento</th>
              <th className="py-3 px-6 text-center">Posição</th>
              <th className="py-3 px-6 text-center">Time</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
            <tr className="bg-gray-200">
              <th className="py-2 px-6 text-center">
                <input
                  type="text"
                  value={searchJogador}
                  placeholder="Pesquisar Jogador 🔎"
                  onChange={(e) => setSearchJogador(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full !text-black placeholder-black text-center py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </th>
              <th className="py-2 px-6 text-center">
                <input
                  type="text"
                  value={searchNacionalidade}
                  placeholder="Pesquisar Nacionalidade 🔎"
                  onChange={(e) => setSearchNacionalidade(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full !text-black placeholder-black text-center py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </th>
              <th className="py-2 px-6 text-center">
                <DatePicker
                  selected={searchDataNascimento}
                  onChange={(date) => setSearchDataNascimento(date)}
                  dateFormat="dd/MM/yyyy"
                  locale="ptBR"
                  placeholderText="Pesquisar Nascimento"
                  className="bg-white border border-gray-300 rounded-lg w-full min-w-[120px] !text-black placeholder-black py-1 px-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition mx-auto block"
                  isClearable
                />
              </th>
              <th className="py-2 px-6 text-center">
                <input
                  type="text"
                  value={searchPosicao}
                  placeholder="Pesquisar Posição 🔎"
                  onChange={(e) => setSearchPosicao(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full !text-black placeholder-black text-center py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </th>
              <th className="py-2 px-6 text-center">
                <select
                  value={searchTime}
                  onChange={(e) => setSearchTime(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full !text-black placeholder-black text-center py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <option value="">Todos</option>
                  {times.map((time) => (
                    <option key={time.id} value={time.id}>
                      {time.name}
                    </option>
                  ))}
                </select>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista && lista.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 px-6 text-center text-gray-500 font-semibold bg-gray-50">
                  Nenhum registro encontrado ...
                </td>
              </tr>
            ) : (
              lista.map((jogador) => (
                <tr
                  key={jogador.id}
                  className="border-b text-black border-gray-200 hover:bg-blue-100 transition-colors duration-200"
                >
                  <td className="py-2 px-6 text-center whitespace-nowrap font-medium">{jogador.name}</td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">{jogador.nationality}</td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {new Date(jogador.birthday).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">{jogador.position}</td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">{getTeamName(jogador.teamId)}</td>
                  <td className="py-2 px-6 text-right whitespace-nowrap flex gap-2 justify-end">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 mr-2 shadow-md hover:scale-105"
                      onClick={() => handleDelete(jogador.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <a
                      className="bg-blue-500 text-white px-4 py-[6px] rounded hover:bg-blue-700 transition-colors duration-300 shadow-md hover:scale-105"
                      href={`/jogadores/editar/${jogador.id}`}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </a>
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
