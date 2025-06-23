import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FormEstatisticaUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    playerId: "",
    teamId: "",
    goals: 0,
    assists: 0,
    matches: 0
  });

  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function fetchEstatistica() {
      if (!id) return;
      const res = await fetch(`http://localhost:3333/estatistic/${id}`);
      if (res.ok) {
        const estatistica = await res.json();
        setFormData({
          playerId: estatistica.playerId ?? "",
          teamId: estatistica.teamId ?? "",
          goals: estatistica.goals,
          assists: estatistica.assists,
          matches: estatistica.matches
        });
      } else {
        alert("Erro ao buscar estatística!");
      }
    }

    async function fetchPlayers() {
      const res = await fetch("http://localhost:3333/player");
      if (res.ok) {
        const data = await res.json();
        setPlayers(data);
      }
    }

    async function fetchTeams() {
      const res = await fetch("http://localhost:3333/team");
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    }

    fetchPlayers();
    fetchTeams();
    fetchEstatistica();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "goals" || name === "assists" || name === "matches"
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      playerId: Number(formData.playerId),
      teamId: Number(formData.teamId),
      goals: Number(formData.goals),
      assists: Number(formData.assists),
      matches: Number(formData.matches)
    };

    const res = await fetch(`http://localhost:3333/estatistic/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      navigate("/estatisticas");
    } else {
      alert("Erro ao atualizar estatística.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-lg bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <h1 className="text-3xl text-white font-bold mb-6">Atualizar Estatística</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="playerId" className="block text-white text-sm font-bold mb-2">Jogador</label>
          <select
            id="playerId"
            name="playerId"
            required
            value={formData.playerId}
            onChange={handleChange}
            className="shadow border-none rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecione o jogador</option>
            {players.map(player => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="teamId" className="block text-white text-sm font-bold mb-2">Time</label>
          <select
            id="teamId"
            name="teamId"
            required
            value={formData.teamId}
            onChange={handleChange}
            className="shadow border-none rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecione o time</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>

        {[
          { id: "matches", label: "Partidas" },
          { id: "goals", label: "Gols" },
          { id: "assists", label: "Assistências" }
        ].map(({ id, label }) => (
          <div className="mb-4" key={id}>
            <label htmlFor={id} className="block text-white text-sm font-bold mb-2">{label}</label>
            <input
              type="number"
              id={id}
              name={id}
              min="0"
              value={formData[id]}
              onChange={handleChange}
              required
              className="shadow border-none rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}

        <div className="flex items-center justify-between">
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Atualizar Estatística
          </button>
          <button
            type="button"
            onClick={() => navigate("/estatisticas")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
