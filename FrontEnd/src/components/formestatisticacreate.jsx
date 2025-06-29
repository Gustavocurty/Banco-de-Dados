import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormEstatisticaCreate() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedContract, setSelectedContract] = useState("");

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

    fetchPlayers();
  }, []);

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

  const handlePlayerChange = (e) => {
    const playerId = e.target.value;
    setSelectedPlayer(playerId);
    setSelectedContract("");
    fetchContractsByPlayer(playerId);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? "" : date.toLocaleDateString("pt-BR");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const form = e.target;

      if (!selectedContract) {
        alert("Selecione um contrato válido.");
        setLoading(false);
        return;
      }

      const contract = contracts.find((c) => c.id === Number(selectedContract));
      if (!contract) throw new Error("Contrato inválido");

      const data = {
        playerId: Number(form.playerId.value),
        teamId: contract.teamId,
        contractStartDate: contract.startDate,
        contractEndDate: contract.endDate,
        matches: Number(form.matches.value),
        goals: Number(form.goals.value),
        assists: Number(form.assists.value),
      };

      const res = await fetch("http://localhost:3333/estatistic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao adicionar estatística");
      }

      navigate("/estatisticas");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-lg w-full bg-blue-400 p-8 rounded-lg shadow-lg mt-30 mx-auto">
      <h1 className="text-3xl text-white font-bold mb-6">Adicionar Estatística</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="playerId" className="block text-white text-sm font-bold mb-2">
            Jogador
          </label>
          <select
            id="playerId"
            name="playerId"
            required
            disabled={loading}
            onChange={handlePlayerChange}
            className="shadow appearance-none rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
            value={selectedPlayer}
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
          <label htmlFor="contractId" className="block text-white text-sm font-bold mb-2">
            Contrato (Time e período)
          </label>
          <select
            id="contractId"
            name="contractId"
            required
            disabled={loading || !selectedPlayer || contracts.length === 0}
            className="shadow appearance-none rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
            value={selectedContract}
            onChange={(e) => setSelectedContract(e.target.value)}
          >
            <option value="">Selecione o contrato</option>
            {contracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.team.name} ({formatDate(contract.startDate)} - {formatDate(contract.endDate)})
              </option>
            ))}
          </select>

          {selectedPlayer && contracts.length === 0 && (
            <p className="text-sm text-white mt-2">Este jogador não possui contratos cadastrados.</p>
          )}
        </div>

        {[{ id: "matches", label: "Partidas" },
          { id: "goals", label: "Gols" },
          { id: "assists", label: "Assistências" }].map(({ id, label }) => (
          <div className="mb-4" key={id}>
            <label htmlFor={id} className="block text-white text-sm font-bold mb-2">
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
              className="shadow appearance-none rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
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
