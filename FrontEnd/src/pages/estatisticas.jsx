import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";

export default function Estatisticas() {
  const [estatisticas, setEstatisticas] = useState([]);
  const [jogadores, setJogadores] = useState([]);
  const [times, setTimes] = useState([]);

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

  return (
    <div className="flex flex-col items-center justify-center w-[80%] bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
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
              <th className="py-3 px-6 text-left whitespace-nowrap">Nome do Jogador</th>
              <th className="py-3 px-6 text-left whitespace-nowrap">Time</th>
              <th className="py-3 px-6 text-left whitespace-nowrap">Partidas</th>
              <th className="py-3 px-6 text-left whitespace-nowrap">Gols</th>
              <th className="py-3 px-6 text-left whitespace-nowrap">Assistências</th>
              <th className="py-3 px-6 text-right whitespace-nowrap">Ações</th>
            </tr>
          </thead>

          <tbody>
            {estatisticas && estatisticas.length > 0 ? (
              estatisticas.map((estatistica) => (
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
                  <td className="py-1 px-6 text-left whitespace-nowrap">{estatistica.matches}</td>
                  <td className="py-1 px-6 text-left whitespace-nowrap">{estatistica.goals}</td>
                  <td className="py-1 px-6 text-left whitespace-nowrap">{estatistica.assists}</td>
                  <td className="py-1 px-6 text-right whitespace-nowrap">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 mr-2"
                      onClick={async () => {
                        if (
                          !window.confirm(
                            "Tem certeza que deseja excluir as estatísticas deste jogador?"
                          )
                        ) return;
                        try {
                          const response = await fetch(
                            `http://localhost:3333/estatistic/${estatistica.id}`,
                            { method: "DELETE" }
                          );
                          if (response.ok) window.location.reload();
                        } catch (error) {
                          console.error("Erro ao excluir as estatísticas:", error);
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
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-3 px-6 text-center text-gray-500">
                  Nenhuma estatística encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
