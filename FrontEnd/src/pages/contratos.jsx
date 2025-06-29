import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ptBR", ptBR);

export default function Contratos() {
  const [contracts, setContracts] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [searchPlayer, setSearchPlayer] = useState("");
  const [searchTeam, setSearchTeam] = useState("");
  const [searchStartDate, setSearchStartDate] = useState(null);
  const [searchEndDate, setSearchEndDate] = useState(null);
  const [filteredContracts, setFilteredContracts] = useState([]);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch("http://localhost:3333/player");
        const data = await res.json();
        setPlayers(data);
      } catch (error) {
        console.error("Erro ao buscar jogadores", error);
        setPlayers([]);
      }
    }
    async function fetchTeams() {
      try {
        const res = await fetch("http://localhost:3333/team");
        const data = await res.json();
        setTeams(data);
      } catch (error) {
        console.error("Erro ao buscar times", error);
        setTeams([]);
      }
    }
    async function fetchContracts() {
      try {
        const res = await fetch("http://localhost:3333/contract");
        const data = await res.json();
        setContracts(data);
      } catch (error) {
        console.error("Erro ao buscar contratos", error);
        setContracts([]);
      }
    }

    fetchPlayers();
    fetchTeams();
    fetchContracts();
  }, []);

  useEffect(() => {
    let filtered = [...contracts];

    if (searchPlayer) {
      const lower = searchPlayer.toLowerCase();
      filtered = filtered.filter((c) => {
        const player = players.find((p) => p.id === c.playerId);
        return player?.name.toLowerCase().includes(lower);
      });
    }

    if (searchTeam) {
      const lower = searchTeam.toLowerCase();
      filtered = filtered.filter((c) => {
        const team = teams.find((t) => t.id === c.teamId);
        return team?.name.toLowerCase().includes(lower);
      });
    }

    if (searchStartDate) {
      filtered = filtered.filter(
        (c) => new Date(c.startDate) >= searchStartDate
      );
    }

    if (searchEndDate) {
      filtered = filtered.filter(
        (c) => new Date(c.endDate) <= searchEndDate
      );
    }

    setFilteredContracts(filtered);
  }, [searchPlayer, searchTeam, searchStartDate, searchEndDate, contracts, players, teams]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este contrato?")) return;

    try {
      const res = await fetch(`http://localhost:3333/contract/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setContracts((prev) => prev.filter((c) => c.id !== id));
        alert("Contrato excluído com sucesso");
      } else {
        alert("Erro ao excluir contrato");
      }
    } catch (error) {
      console.error("Erro ao excluir contrato", error);
      alert("Erro ao excluir contrato");
    }
  };

  const getPlayerName = (id) => {
    const player = players.find((p) => p.id === id);
    return player ? player.name : "—";
  };

  const getTeamName = (id) => {
    const team = teams.find((t) => t.id === id);
    return team ? team.name : "—";
  };

  return (
    <div className="flex flex-col items-center justify-center w-[95%] bg-blue-400 p-8 rounded-lg shadow-lg mt-10 text-white">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-3xl font-bold">CONTRATOS</h1>
        <Link
          to="/contratos/criar"
          className="bg-white text-black px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faAdd} />
          <p className="font-bold">Adicionar Contrato</p>
        </Link>
      </div>

      <div className="overflow-x-auto w-full mb-4">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">Jogador</th>
              <th className="py-3 px-6 text-center">Time</th>
              <th className="py-3 px-6 text-center">Data do Início</th>
              <th className="py-3 px-6 text-center">Data do Fim</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
            <tr className="bg-gray-200">
              <th className="py-2 px-6 text-center">
                <input
                  type="text"
                  value={searchPlayer}
                  placeholder="Pesquisar Jogador 🔎"
                  onChange={(e) => setSearchPlayer(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full !text-black placeholder-black text-center py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </th>
              <th className="py-2 px-6 text-center">
                <input
                  type="text"
                  value={searchTeam}
                  placeholder="Pesquisar Time 🔎"
                  onChange={(e) => setSearchTeam(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full !text-black placeholder-black text-center py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </th>
              <th className="py-2 px-6 text-center">
                <DatePicker
                  selected={searchStartDate}
                  onChange={(date) => setSearchStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  locale="ptBR"
                  placeholderText="Data do Início 🔎"
                  className="bg-white border border-gray-300 rounded-lg w-full min-w-[120px] !text-black placeholder-black py-1 px-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition mx-auto block"
                  isClearable
                />
              </th>
              <th className="py-2 px-6 text-center">
                <DatePicker
                  selected={searchEndDate}
                  onChange={(date) => setSearchEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  locale="ptBR"
                  placeholderText="Data do Fim 🔎"
                  className="bg-white border border-gray-300 rounded-lg w-full min-w-[120px] !text-black placeholder-black py-1 px-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition mx-auto block"
                  isClearable
                />
              </th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredContracts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 px-6 text-center text-gray-500 font-semibold bg-gray-50"
                >
                  Nenhum contrato encontrado.
                </td>
              </tr>
            ) : (
              filteredContracts.map((contract) => (
                <tr
                  key={contract.id}
                  className="border-b text-black border-gray-200 hover:bg-blue-100 transition-colors duration-200"
                >
                  <td className="py-2 px-6 text-center whitespace-nowrap font-medium">
                    {getPlayerName(contract.playerId)}
                  </td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {getTeamName(contract.teamId)}
                  </td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {new Date(contract.startDate).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {new Date(contract.endDate).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-2 px-6 text-right whitespace-nowrap flex gap-2 justify-end">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 shadow-md hover:scale-105"
                      onClick={() => handleDelete(contract.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <Link
                      to={`/contratos/editar/${contract.id}`}
                      className="bg-blue-500 text-white px-4 py-[6px] rounded hover:bg-blue-700 transition-colors duration-300 shadow-md hover:scale-105"
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
