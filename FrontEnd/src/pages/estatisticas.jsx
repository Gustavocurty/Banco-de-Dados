import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ptBR", ptBR);

export default function Estatisticas() {
  const [estatisticas, setEstatisticas] = useState([]);
  const [jogadores, setJogadores] = useState([]);
  const [times, setTimes] = useState([]);
  const [searchPlayer, setSearchPlayer] = useState("");
  const [searchTeam, setSearchTeam] = useState("");
  const [searchGoals, setSearchGoals] = useState("");
  const [searchAssists, setSearchAssists] = useState("");
  const [searchMatches, setSearchMatches] = useState("");
  const [searchContractStart, setSearchContractStart] = useState(null);
  const [searchContractEnd, setSearchContractEnd] = useState(null);

  const formatDate = (str) => {
    const date = new Date(str);
    return isNaN(date) ? "" : date.toLocaleDateString("pt-BR");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estatRes, jogRes, timeRes] = await Promise.all([
          fetch("http://localhost:3333/estatistic"),
          fetch("http://localhost:3333/player"),
          fetch("http://localhost:3333/team"),
        ]);
        const [estatData, jogData, timeData] = await Promise.all([
          estatRes.json(),
          jogRes.json(),
          timeRes.json(),
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

  const filtrarEstatisticas = () => {
    return estatisticas.filter((estat) => {
      if (searchPlayer && estat.playerId !== searchPlayer) return false;
      if (searchTeam && estat.teamId !== searchTeam) return false;

      if (searchContractStart) {
        if (!estat.contractStartDate) return false;
        const contractStart = new Date(estat.contractStartDate);
        if (contractStart < searchContractStart) return false;
      }
      if (searchContractEnd) {
        if (!estat.contractEndDate) return false;
        const contractEnd = new Date(estat.contractEndDate);
        if (contractEnd > searchContractEnd) return false;
      }

      if (searchMatches !== "") {
        const matchesNum = Number(searchMatches);
        if (isNaN(matchesNum) || matchesNum < 0) return false;
        if (estat.matches !== matchesNum) return false;
      }

      if (searchGoals !== "") {
        const goalsNum = Number(searchGoals);
        if (isNaN(goalsNum) || goalsNum < 0) return false;
        if (estat.goals !== goalsNum) return false;
      }

      if (searchAssists !== "") {
        const assistsNum = Number(searchAssists);
        if (isNaN(assistsNum) || assistsNum < 0) return false;
        if (estat.assists !== assistsNum) return false;
      }

      return true;
    });
  };

  const lista = filtrarEstatisticas();

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir as estatísticas deste jogador?")) return;

    try {
      const res = await fetch(`http://localhost:3333/estatistic/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEstatisticas((prev) => prev.filter((estat) => estat.id !== id));
        alert("Estatística excluída com sucesso!");
      } else {
        alert("Erro ao excluir as estatísticas");
      }
    } catch (error) {
      console.error("Erro ao excluir as estatísticas", error);
      alert("Erro ao excluir as estatísticas");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-[95%] bg-blue-400 p-8 rounded-lg shadow-lg mt-10">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-3xl text-white font-bold">ESTATÍSTICAS</h1>
        <Link
          to="/estatisticas/criar"
          className="bg-white text-black px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faAdd} />
          <p className="font-bold">Adicionar Estatísticas</p>
        </Link>
      </div>

      <div className="overflow-x-auto w-full">
        <table
          className="min-w-full bg-white shadow-md rounded-lg overflow-hidden"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr
              className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal"
              style={{ userSelect: "none" }}
            >
              <th className="py-3 px-6 text-center">Jogador</th>
              <th className="py-3 px-6 text-center">Time</th>
              <th className="py-3 px-6 text-center">Contrato</th>
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
                  style={{ boxSizing: "border-box" }}
                >
                  <option value="">Todos</option>
                  {jogadores.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name}
                    </option>
                  ))}
                </select>
              </th>
              <th className="py-2 px-6 text-center">
                <select
                  value={searchTeam}
                  onChange={(e) => setSearchTeam(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full text-black text-center py-1 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  style={{ boxSizing: "border-box" }}
                >
                  <option value="">Todos</option>
                  {times.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </th>
              <th
                className="py-2 px-6 text-center flex flex-col gap-1 justify-center items-center"
                style={{ boxSizing: "border-box" }}
              >
                <DatePicker
                  selected={searchContractStart}
                  onChange={(date) => setSearchContractStart(date)}
                  dateFormat="dd/MM/yyyy"
                  locale="ptBR"
                  placeholderText="Início Contrato"
                  isClearable
                  className="bg-white border border-gray-300 rounded-lg w-full text-black text-center py-1 px-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  style={{ boxSizing: "border-box" }}
                />
                <DatePicker
                  selected={searchContractEnd}
                  onChange={(date) => setSearchContractEnd(date)}
                  dateFormat="dd/MM/yyyy"
                  locale="ptBR"
                  placeholderText="Fim Contrato"
                  isClearable
                  className="bg-white border border-gray-300 rounded-lg w-full text-black text-center py-1 px-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  style={{ boxSizing: "border-box" }}
                />
              </th>
              <th className="py-2 px-6 text-center">
                <input
                  type="number"
                  min="0"
                  value={searchMatches}
                  onChange={(e) => setSearchMatches(e.target.value)}
                  placeholder="Partidas 🔎"
                  className="bg-white border border-gray-300 rounded-lg w-full text-black text-center py-1 px-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  style={{ width: "120px", boxSizing: "border-box" }}
                />
              </th>
              <th className="py-2 px-6 text-center">
                <input
                  type="number"
                  min="0"
                  value={searchGoals}
                  onChange={(e) => setSearchGoals(e.target.value)}
                  placeholder="Gols 🔎"
                  className="bg-white border border-gray-300 rounded-lg text-black text-center py-1 px-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  style={{ width: "90px", boxSizing: "border-box" }}
                />
              </th>
              <th className="py-2 px-6 text-center">
                <input
                  type="number"
                  min="0"
                  value={searchAssists}
                  onChange={(e) => setSearchAssists(e.target.value)}
                  placeholder="Assistências 🔎"
                  className="bg-white border border-gray-300 rounded-lg text-black text-center py-1 px-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  style={{ width: "150px", boxSizing: "border-box" }}
                />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 px-6 text-center text-gray-500 font-semibold bg-gray-50"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              lista.map((estatistica) => (
                <tr
                  key={estatistica.id}
                  className="border-b text-black border-gray-200 hover:bg-blue-100 transition-colors duration-200"
                >
                  <td className="py-2 px-6 text-center whitespace-nowrap font-medium">
                    {getPlayerName(estatistica.playerId)}
                  </td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {getTeamName(estatistica.teamId)}
                  </td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {estatistica.contractStartDate && estatistica.contractEndDate
                      ? `${formatDate(estatistica.contractStartDate)} - ${formatDate(
                          estatistica.contractEndDate
                        )}`
                      : "Sem contrato"}
                  </td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {estatistica.matches}
                  </td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {estatistica.goals}
                  </td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {estatistica.assists}
                  </td>
                  <td className="py-2 px-6 text-right whitespace-nowrap flex gap-2 justify-end">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 shadow-md hover:scale-105"
                      onClick={() => handleDelete(estatistica.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <Link
                      to={`/estatisticas/editar/${estatistica.id}`}
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
