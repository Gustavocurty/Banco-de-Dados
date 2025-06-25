import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";

export default function Contratos() {
  const [contratos, setContratos] = useState([]);
  const [jogadores, setJogadores] = useState([]);
  const [times, setTimes] = useState([]);
  const [search, setSearch] = useState("");
  const [contratosSelecionados, setContratosSelecionados] = useState([]);

  useEffect(() => {
    const fetchContratos = async () => {
      try {
        const res = await fetch("http://localhost:3333/contract");
        const data = await res.json();
        setContratos(data);
      } catch (error) {
        console.error("Erro ao buscar contratos:", error);
      }
    };
    fetchContratos();
  }, []);

  useEffect(() => {
    const fetchJogadores = async () => {
      try {
        const res = await fetch("http://localhost:3333/player");
        const data = await res.json();
        setJogadores(data);
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
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
        console.error("Erro ao buscar times:", error);
      }
    };
    fetchTimes();
  }, []);

  const getPlayerName = (id) => {
    const player = jogadores.find((j) => j.id === id);
    return player ? player.name : "Sem nome";
  };

  const getTeamName = (id) => {
    const team = times.find((t) => t.id === id);
    return team ? team.name : "Sem time";
  };

  return (
    <div className="flex flex-col items-center justify-center w-[80%] bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-3xl text-white font-bold">CONTRATOS</h1>

        <div className="flex items-center">
          <input
            type="text"
            value={search}
            placeholder="Pesquisar Jogador"
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white rounded-lg w-50 mr-2 text-black placeholder-black py-1 px-3 focus:outline-none focus:shadow-outline"
          />
          <a
            href="/contratos/criar"
            className="bg-white text-black px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faAdd} />
            <p className="font-bold">Adicionar Contrato</p>
          </a>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left whitespace-nowrap">Jogador</th>
              <th className="py-3 px-6 text-left whitespace-nowrap">Time</th>
              <th className="py-3 px-6 text-left whitespace-nowrap">Início</th>
              <th className="py-3 px-6 text-left whitespace-nowrap">Fim</th>
              <th className="py-3 px-6 text-right whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody>
            {contratos.length > 0 ? (
              contratos.map((contrato) => (
                <tr
                  key={contrato.id}
                  className="border-b text-black border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-1 px-6 text-left whitespace-nowrap">
                    {getPlayerName(contrato.playerId)}
                  </td>
                  <td className="py-1 px-6 text-left whitespace-nowrap">
                    {getTeamName(contrato.teamId)}
                  </td>
                  <td className="py-1 px-6 text-left whitespace-nowrap">
                    {new Date(contrato.startDate).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-1 px-6 text-left whitespace-nowrap">
                    {new Date(contrato.endDate).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-1 px-6 text-right whitespace-nowrap">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 mr-2"
                      onClick={async () => {
                        if (
                          !window.confirm(
                            "Tem certeza que deseja excluir este contrato?"
                          )
                        )
                          return;
                        try {
                          const response = await fetch(
                            `http://localhost:3333/contract/${contrato.id}`,
                            { method: "DELETE" }
                          );
                          if (response.ok) window.location.reload();
                        } catch (error) {
                          console.error("Erro ao excluir o contrato:", error);
                          alert("Erro ao excluir o contrato");
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <a
                      className="bg-blue-500 text-white px-4 py-[6px] rounded hover:bg-blue-700 transition-colors duration-300"
                      href={`/contratos/editar/${contrato.id}`}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-6 text-center text-gray-500">
                  Nenhum contrato encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
