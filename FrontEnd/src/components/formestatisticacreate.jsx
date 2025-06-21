import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormEstatisticaCreate() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const form = e.target;
      const data = {
        playerId: Number(form.playerId.value),
        teamId: Number(form.teamId.value),
        matches: Number(form.matches.value),
        goals: Number(form.goals.value),
        assists: Number(form.assists.value),
      };

      const res = await fetch("http://localhost:3333/estatistic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao adicionar estatística");
      navigate("/estatisticas");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-lg bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <h1 className="text-3xl text-white font-bold mb-6">Adicionar Estatística</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="playerId">
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
          <label className="block text-white text-sm font-bold mb-2" htmlFor="teamId">
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

        {[
          { id: "matches", label: "Partidas" },
          { id: "goals", label: "Gols" },
          { id: "assists", label: "Assistências" },
        ].map(({ id, label }) => (
          <div className="mb-4" key={id}>
            <label className="block text-white text-sm font-bold mb-2" htmlFor={id}>
              {label}
            </label>
            <input
              type="number"
              id={id}
              name={id}
              min="0"
              required
              disabled={loading}
              placeholder={`Número de ${label.toLowerCase()}`}
              className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-500 cursor-pointer hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Adicionar Estatística
          </button>
          <button
            type="button"
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 cursor-pointer"
            onClick={() => navigate("/estatisticas")}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
