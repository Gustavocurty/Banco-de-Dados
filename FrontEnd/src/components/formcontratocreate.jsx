import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormContratoCreate() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch("http://localhost:3333/player");
        if (!res.ok) throw new Error("Erro ao buscar jogadores");
        const data = await res.json();
        setPlayers(data);
      } catch {
        setPlayers([]);
      }
    }

    async function fetchTeams() {
      try {
        const res = await fetch("http://localhost:3333/team");
        if (!res.ok) throw new Error("Erro ao buscar times");
        const data = await res.json();
        setTeams(data);
      } catch {
        setTeams([]);
      }
    }

    fetchPlayers();
    fetchTeams();
  }, []);

  const formatDateLocalToISO = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day), 12);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = {
      playerId: Number(form.playerId.value),
      teamId: Number(form.teamId.value),
      startDate: formatDateLocalToISO(form.startDate.value),
      endDate: formatDateLocalToISO(form.endDate.value),
    };

    try {
      const res = await fetch("http://localhost:3333/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Erro ao criar contrato");
        return;
      }

      navigate("/contratos");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-lg w-full bg-blue-400 p-8 rounded-lg shadow-lg mt-10 mx-auto">
      <h1 className="text-3xl text-white font-bold mb-6">Adicionar Contrato</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div>
          <label htmlFor="playerId" className="block text-white font-bold mb-2">
            Jogador
          </label>
          <select
            id="playerId"
            name="playerId"
            required
            className="w-full p-2 rounded bg-white text-black"
          >
            <option value="">Selecione o jogador</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="teamId" className="block text-white font-bold mb-2">
            Time
          </label>
          <select
            id="teamId"
            name="teamId"
            required
            className="w-full p-2 rounded bg-white text-black"
          >
            <option value="">Selecione o time</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-white font-bold mb-2">
            Data Início
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            required
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-white font-bold mb-2">
            Data Fim
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            required
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Adicionar Contrato
          </button>
          <button
            type="button"
            onClick={() => navigate("/contratos")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
