import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormContratoCreate() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Função para evitar erro na data: fixa a hora para 12:00 local, para não alterar o dia
  const formatDateLocalToISO = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const form = e.target;
      const data = {
        playerId: Number(form.playerId.value),
        teamId: Number(form.teamId.value),
        startDate: formatDateLocalToISO(form.startDate.value),
        endDate: formatDateLocalToISO(form.endDate.value),
      };

      const res = await fetch("http://localhost:3333/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.error || "Erro ao criar contrato");
      }

      navigate("/contratos");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-lg bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <h1 className="text-3xl text-white font-bold mb-6">Adicionar Contrato</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="playerId"
          >
            Jogador
          </label>
          <select
            id="playerId"
            name="playerId"
            required
            disabled={loading}
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecione o jogador</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="teamId"
          >
            Time
          </label>
          <select
            id="teamId"
            name="teamId"
            required
            disabled={loading}
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecione o time</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="startDate"
          >
            Data de Início
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            required
            disabled={loading}
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="endDate"
          >
            Data de Fim
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            required
            disabled={loading}
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Adicionar Contrato
          </button>
          <button
            type="button"
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 cursor-pointer"
            onClick={() => navigate("/contratos")}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
