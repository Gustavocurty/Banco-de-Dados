import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Contratos() {
  const [contratos, setContratos] = useState([]);
  const [jogadores, setJogadores] = useState([]);
  const [times, setTimes] = useState([]);
  const [searchPlayer, setSearchPlayer] = useState("");
  const [searchTeam, setSearchTeam] = useState("");
  const [searchStart, setSearchStart] = useState(null);
  const [searchEnd, setSearchEnd] = useState(null);
  const [contratosSelecionados, setContratosSelecionados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contratosRes, jogadoresRes, timesRes] = await Promise.all([
          fetch("http://localhost:3333/contract"),
          fetch("http://localhost:3333/player"),
          fetch("http://localhost:3333/team")
        ]);
        const [contratosData, jogadoresData, timesData] = await Promise.all([
          contratosRes.json(),
          jogadoresRes.json(),
          timesRes.json()
        ]);
        setContratos(contratosData);
        setJogadores(jogadoresData);
        setTimes(timesData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchPlayer && !searchTeam && !searchStart && !searchEnd) {
      setContratosSelecionados([]);
      return;
    }
    const params = new URLSearchParams();
    if (searchPlayer) params.append("playerId", searchPlayer);
    if (searchTeam) params.append("teamId", searchTeam);
    if (searchStart) params.append("startDate", searchStart.toISOString().split("T")[0]);
    if (searchEnd) params.append("endDate", searchEnd.toISOString().split("T")[0]);

    const fetchFiltrados = async () => {
      try {
        const res = await fetch(`http://localhost:3333/contract?${params.toString()}`);
        const data = await res.json();
        setContratosSelecionados(data);
      } catch (error) {
        console.error("Erro ao buscar contratos filtrados:", error);
      }
    };
    fetchFiltrados();
  }, [searchPlayer, searchTeam, searchStart, searchEnd]);

  const getPlayerName = (id) => jogadores.find((j) => j.id === id)?.name || "Sem nome";
  const getTeamName = (id) => times.find((t) => t.id === id)?.name || "Sem time";

  const lista = searchPlayer || searchTeam || searchStart || searchEnd ? contratosSelecionados : contratos;

  return (
    <div className="flex flex-col items-center justify-center w-[95%] bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-3xl text-white font-bold">CONTRATOS</h1>
        <a
          href="/contratos/criar"
          className="bg-white text-black px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faAdd} />
          <p className="font-bold">Adicionar Contrato</p>
        </a>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">Jogador</th>
              <th className="py-3 px-6 text-center">Time</th>
              <th className="py-3 px-6 text-center">Início</th>
              <th className="py-3 px-6 text-center">Fim</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
            <tr className="bg-gray-200">
              <th className="py-2 px-6 text-center">
                <select
                  value={searchPlayer}
                  onChange={(e) => setSearchPlayer(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full text-black text-center py-1 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <option value="">Todos os Jogadores</option>
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
                  <option value="">Todos os Times</option>
                  {times.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </th>
              <th className="py-2 px-6 text-center">
                <DatePicker
                  selected={searchStart}
                  dateFormat="dd/MM/yyyy"
                  onChange={(date) => setSearchStart(date)}
                  className="bg-white border border-gray-300 rounded-lg w-full text-black text-center py-1 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholderText="Data de Início"
                  isClearable
                />
              </th>
              <th className="py-2 px-6 text-center">
                <DatePicker
                  selected={searchEnd}
                  dateFormat="dd/MM/yyyy"
                  onChange={(date) => setSearchEnd(date)}
                  className="bg-white border border-gray-300 rounded-lg w-full text-black text-center py-1 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholderText="Data de Fim"
                  isClearable
                />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-3 px-6 text-center text-gray-500">
                  Nenhum registro encontrado ...
                </td>
              </tr>
            ) : (
              lista.map((contrato) => (
                <tr
                  key={contrato.id}
                  className="border-b text-black border-gray-200 hover:bg-blue-100 transition-colors duration-200"
                >
                  <td className="py-2 px-6 text-center whitespace-nowrap font-medium">
                    {getPlayerName(contrato.playerId)}
                  </td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {getTeamName(contrato.teamId)}
                  </td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {new Date(contrato.startDate).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {new Date(contrato.endDate).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-2 px-6 text-right whitespace-nowrap flex gap-2 justify-end">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 shadow-md hover:scale-105"
                      onClick={async () => {
                        if (window.confirm("Tem certeza que deseja excluir este contrato?")) {
                          try {
                            const res = await fetch(`http://localhost:3333/contract/${contrato.id}`, {
                              method: "DELETE"
                            });
                            if (res.ok) window.location.reload();
                          } catch (error) {
                            console.error("Erro ao excluir o contrato:", error);
                            alert("Erro ao excluir o contrato");
                          }
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <a
                      className="bg-blue-500 text-white px-4 py-[6px] rounded hover:bg-blue-700 transition-colors duration-300 shadow-md hover:scale-105"
                      href={`/contratos/editar/${contrato.id}`}
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