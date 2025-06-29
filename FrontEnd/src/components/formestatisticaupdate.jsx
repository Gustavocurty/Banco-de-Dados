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
    matches: 0,
  });

  const [players, setPlayers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState("");

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("pt-BR");
  };

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

    async function fetchContractsByPlayer(playerId) {
      if (!playerId) {
        setContracts([]);
        return;
      }
      try {
        const res = await fetch(`http://localhost:3333/contract/player/${playerId}`);
        if (!res.ok) throw new Error("Erro ao buscar contratos do jogador");
        const data = await res.json();
        setContracts(data);
      } catch {
        setContracts([]);
      }
    }

    async function fetchEstatistica() {
      if (!id) return;
      try {
        const res = await fetch(`http://localhost:3333/estatistic/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar estatística");
        const estatistica = await res.json();

        setFormData({
          playerId: estatistica.playerId ?? "",
          teamId: estatistica.teamId ?? "",
          goals: estatistica.goals,
          assists: estatistica.assists,
          matches: estatistica.matches,
        });

        await fetchContractsByPlayer(estatistica.playerId);

        setSelectedContract(""); 
        setTimeout(() => {
          const contrato = contracts.find((c) => c.teamId === estatistica.teamId);
          if (contrato) setSelectedContract(contrato.id.toString());
        }, 100);
      } catch (error) {
        alert(error.message);
      }
    }

    fetchPlayers();
    fetchEstatistica();
  }, [id, contracts.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: ["goals", "assists", "matches"].includes(name) ? Number(value) : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const contrato = contracts.find((c) => c.id === Number(selectedContract));
    if (!contrato) {
      alert("Contrato atual não encontrado.");
      setLoading(false);
      return;
    }

    const payload = {
      playerId: Number(formData.playerId),
      teamId: contrato.teamId,
      contractStartDate: contrato.startDate,
      contractEndDate: contrato.endDate,
      goals: Number(formData.goals),
      assists: Number(formData.assists),
      matches: Number(formData.matches),
    };

    try {
      const res = await fetch(`http://localhost:3333/estatistic/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate("/estatisticas");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Erro ao atualizar estatística.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-lg w-full bg-blue-400 p-8 rounded-lg shadow-lg mt-30 mx-auto">
      <h1 className="text-3xl text-white font-bold mb-6">Atualizar Estatística</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">

        <div className="mb-4">
          <label htmlFor="playerId" className="block text-white text-sm font-bold mb-2">
            Jogador
          </label>
          <select
            id="playerId"
            name="playerId"
            required
            value={formData.playerId}
            onChange={handleChange}
            disabled={loading}
            className="shadow appearance-none rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecione o jogador</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        {/* Exibição do contrato atual fixo, para não ter risco da pessoa alterar pra um contrato já existente */}
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">Contrato atual (Time e período)</label>
          <div className="py-2 px-3 bg-white text-black rounded shadow">
            {selectedContract
              ? (() => {
                  const contrato = contracts.find((c) => c.id === Number(selectedContract));
                  if (!contrato) return "Contrato não encontrado";
                  return `${contrato.team.name} (${formatDate(contrato.startDate)} - ${formatDate(contrato.endDate)})`;
                })()
              : "Carregando..."}
          </div>
        </div>

        {[ 
          { id: "matches", label: "Partidas" },
          { id: "goals", label: "Gols" },
          { id: "assists", label: "Assistências" },
        ].map(({ id, label }) => (
          <div className="mb-4" key={id}>
            <label htmlFor={id} className="block text-white text-sm font-bold mb-2">
              {label}
            </label>
            <input
              type="number"
              id={id}
              name={id}
              min="0"
              value={formData[id]}
              onChange={handleChange}
              required
              disabled={loading}
              className="shadow appearance-none rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            Atualizar Estatística
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => navigate("/estatisticas")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
