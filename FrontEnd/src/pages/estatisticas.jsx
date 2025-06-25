import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";

export default function Estatisticas() {
  const [estatisticas, setEstatisticas] = useState([]);
  const [jogadores, setJogadores] = useState([]);
  const [times, setTimes] = useState([]);
  const [searchPlayer, setSearchPlayer] = useState("");
  const [searchTeam, setSearchTeam] = useState("");
  const [searchGoals, setSearchGoals] = useState("");
  const [searchAssists, setSearchAssists] = useState("");
  const [searchMatches, setSearchMatches] = useState("");
  const [estatisticasFiltradas, setEstatisticasFiltradas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estatRes, jogRes, timeRes] = await Promise.all([
          fetch("http://localhost:3333/estatistic"),
          fetch("http://localhost:3333/player"),
          fetch("http://localhost:3333/team")
        ]);
        const [estatData, jogData, timeData] = await Promise.all([
          estatRes.json(),
          jogRes.json(),
          timeRes.json()
        ]);
        setEstatisticas(estatData);
        setJogadores(jogData);
        setTimes(timeData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  const getPlayerName = (playerId) => {
    const jogador = jogadores.find((j) => j.id === playerId);
    return jogador ? jogador.name : "Sem nome";
  };

  const getTeamName = (teamId) => {
    const time = times.find((t) => t.id === teamId);
    return time ? time.name : "Sem time";
  };

  useEffect(() => {
    if (!searchPlayer && !searchTeam && !searchGoals && !searchAssists && !searchMatches) {
      setEstatisticasFiltradas([]);
      return;
    }
    const params = new URLSearchParams();
    if (searchPlayer) params.append("playerId", searchPlayer);
    if (searchTeam) params.append("teamId", searchTeam);
    if (searchGoals) params.append("goals", searchGoals);
    if (searchAssists) params.append("assists", searchAssists);
    if (searchMatches) params.append("matches", searchMatches);

    const fetchFiltradas = async () => {
      try {
        const res = await fetch(`http://localhost:3333/estatistic?${params.toString()}`);
        const data = await res.json();
        setEstatisticasFiltradas(data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas filtradas:", error);
      }
    };
    fetchFiltradas();
  }, [searchPlayer, searchTeam, searchGoals, searchAssists, searchMatches]);

  const lista = (searchPlayer || searchTeam || searchGoals || searchAssists || searchMatches)
    ? estatisticasFiltradas
    : estatisticas;

  return (
    <div className="flex flex-col items-center justify-center w-[95%] bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-3xl text-white font-bold">ESTATÍSTICAS</h1>
        <a
          href="/estatisticas/criar"
          className="bg-white text-black px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faAdd} />
          <p className="font-bold">Adicionar Estatísticas</p>
        </a>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">Jogador</th>
              <th className="py-3 px-6 text-center">Time</th>
              <th className="py-3 px-6 text-center">Partidas</th>
              <th className="py-3 px-6 text-center">Gols</th>
              <th className="py-3 px-6 text-center">Assistências</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
            <tr className="bg-gray-200">
              <th className="py-2 px-6 text-center">
                <select
                  value={searchPlayer}
                  onChange={(e) => setSearchPlayer(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full text-black text-center py-1 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <option value="">Todos</option>
                  {jogadores.map((j) => (
                    <option key={j.id} value={j.id}>{j.name}</option>
                  ))}
                </select>
              </th>
              <th className="py-2 px-6 text-center">
                <select
                  value={searchTeam}
                  onChange={(e) => setSearchTeam(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full text-black text-center py-1 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <option value="">Todos</option>
                  {times.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </th>
              <th className="py-2 px-6 text-center">
                <input
                  type="number"
                  value={searchMatches}
                  onChange={(e) => setSearchMatches(e.target.value)}
                  placeholder="Partidas 🔎"
                  className="bg-white border border-gray-300 rounded-lg w-full text-black text-center py-1 px-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </th>
              <th className="py-2 px-6 text-center">
                <input
                  type="number"
                  value={searchGoals}
                  onChange={(e) => setSearchGoals(e.target.value)}
                  placeholder="Gols 🔎"
                  className="bg-white border border-gray-300 rounded-lg w-full text-black text-center py-1 px-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </th>
              <th className="py-2 px-6 text-center">
                <input
                  type="number"
                  value={searchAssists}
                  onChange={(e) => setSearchAssists(e.target.value)}
                  placeholder="Assistências 🔎"
                  className="bg-white border border-gray-300 rounded-lg w-full text-black text-center py-1 px-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 px-6 text-center text-gray-500 font-semibold bg-gray-50">
                  Nenhum registro encontrado ...
                </td>
              </tr>
            ) : (
              lista.map((estatistica) => (
                <tr key={estatistica.id} className="border-b text-black border-gray-200 hover:bg-blue-100 transition-colors duration-200">
                  <td className="py-2 px-6 text-center whitespace-nowrap font-medium">{getPlayerName(estatistica.playerId)}</td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">{getTeamName(estatistica.teamId)}</td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">{estatistica.matches}</td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">{estatistica.goals}</td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">{estatistica.assists}</td>
                  <td className="py-2 px-6 text-right whitespace-nowrap flex gap-2 justify-end">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 shadow-md hover:scale-105"
                      onClick={async () => {
                        if (window.confirm("Tem certeza que deseja excluir as estatísticas deste jogador?")) {
                          try {
                            const res = await fetch(`http://localhost:3333/estatistic/${estatistica.id}`, {
                              method: "DELETE"
                            });
                            if (res.ok) window.location.reload();
                          } catch (error) {
                            console.error("Erro ao excluir as estatísticas:", error);
                            alert("Erro ao excluir as estatísticas");
                          }
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <a
                      className="bg-blue-500 text-white px-4 py-[6px] rounded hover:bg-blue-700 transition-colors duration-300 shadow-md hover:scale-105"
                      href={`/estatisticas/editar/${estatistica.id}`}
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
