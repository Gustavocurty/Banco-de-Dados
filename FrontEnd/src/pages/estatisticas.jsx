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
    const fetchEstatisticas = async () => {
      try {
        const res = await fetch("http://localhost:3333/estatistic");
        const data = await res.json();
        setEstatisticas(data);
      } catch (error) {
        console.error("Erro ao buscar as estatísticas:", error);
      }
    };
    fetchEstatisticas();
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("http://localhost:3333/player");
        const data = await res.json();
        setJogadores(data);
      } catch (error) {
        console.error("Erro ao buscar os jogadores:", error);
      }
    };
    fetchPlayers();
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

  const getPlayerName = (playerId) => {
    if (!playerId) return "Sem nome";
    const jogador = jogadores.find((j) => j.id === playerId);
    return jogador ? jogador.name : "Sem nome";
  };

  const getTeamName = (teamId) => {
    if (!teamId) return "Sem time";
    const team = times.find((t) => t.id === teamId);
    return team ? team.name : "Sem time";
  };

  useEffect(() => {
    // Se todos os filtros estiverem vazios, limpa o filtro
    if (
      !searchPlayer &&
      !searchTeam &&
      !searchGoals &&
      !searchAssists &&
      !searchMatches
    ) {
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
        const res = await fetch(
          `http://localhost:3333/estatistic?${params.toString()}`
        );
        const data = await res.json();
        setEstatisticasFiltradas(data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas filtradas:", error);
      }
    };

    fetchFiltradas();
  }, [searchPlayer, searchTeam, searchGoals, searchAssists, searchMatches]);

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
              <th className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex flex-col items-center">
                  <p className="w-50 text-center mb-1">Jogador</p>
                  <select
                    value={searchPlayer}
                    onChange={(e) => setSearchPlayer(e.target.value)}
                    className="bg-white rounded-lg w-25 text-black py-1 px-2"
                  >
                    <option value="">Todos</option>
                    {jogadores.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex flex-col items-center">
                  <p className="w-50 text-center mb-1">Time</p>
                  <select
                    value={searchTeam}
                    onChange={(e) => setSearchTeam(e.target.value)}
                    className="bg-white rounded-lg w-25 text-black py-1 px-2"
                  >
                    <option value="">Todos</option>
                    {times.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex flex-col items-center">
                  <p className="w-50 text-center mb-1">Partidas</p>
                  <input
                    type="number"
                    value={searchMatches}
                    placeholder="Partida 🔎s"
                    onChange={(e) => setSearchMatches(e.target.value)}
                    className="bg-white rounded-lg w-25 text-black placeholder-black py-1 px-2 text-center"
                  />
                </div>
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex flex-col items-center">
                  <p className="w-50 text-center mb-1">Gols</p>
                  <input
                    type="number"
                    value={searchGoals}
                    placeholder="Gols 🔎"
                    onChange={(e) => setSearchGoals(e.target.value)}
                    className="bg-white rounded-lg w-25 text-black flex placeholder-black py-1 px-2 text-center"
                  />
                </div>
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex flex-col items-center">
                  <p className="w-50 text-center mb-1">Assistências</p>
                  <input
                    type="number"
                    value={searchAssists}
                    placeholder="Assistências 🔎"
                    onChange={(e) => setSearchAssists(e.target.value)}
                    className="bg-white rounded-lg w-35 text-black placeholder-black py-1 px-2 text-center"
                  />
                </div>
              </th>
              <th className="py-3 px-6 text-right whitespace-nowrap">Ações</th>
            </tr>
          </thead>

          <tbody>
            {(searchPlayer ||
            searchTeam ||
            searchGoals ||
            searchAssists ||
            searchMatches
              ? estatisticasFiltradas
              : estatisticas
            ).map((estatistica) => (
              <tr
                key={estatistica.id}
                className="border-b text-black border-gray-200 hover:bg-gray-100"
              >
                <td className="py-1 px-6 text-left whitespace-nowrap">
                  {getPlayerName(estatistica.playerId)}
                </td>
                <td className="py-1 px-6 text-left whitespace-nowrap">
                  {getTeamName(estatistica.teamId)}
                </td>
                <td className="py-1 px-6 text-left whitespace-nowrap">
                  {estatistica.matches}
                </td>
                <td className="py-1 px-6 text-left whitespace-nowrap">
                  {estatistica.goals}
                </td>
                <td className="py-1 px-6 text-left whitespace-nowrap">
                  {estatistica.assists}
                </td>
                <td className="py-1 px-6 text-right whitespace-nowrap">
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 mr-2"
                    onClick={async () => {
                      if (
                        !window.confirm(
                          "Tem certeza que deseja excluir as estatísticas deste jogador?"
                        )
                      )
                        return;
                      try {
                        const response = await fetch(
                          `http://localhost:3333/estatistic/${estatistica.id}`,
                          { method: "DELETE" }
                        );
                        if (response.ok) window.location.reload();
                      } catch (error) {
                        console.error(
                          "Erro ao excluir as estatísticas:",
                          error
                        );
                        alert("Erro ao excluir as estatísticas");
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <a
                    className="bg-blue-500 text-white px-4 py-[6px] rounded hover:bg-blue-700 transition-colors duration-300"
                    href={`/estatisticas/editar/${estatistica.id}`}
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
