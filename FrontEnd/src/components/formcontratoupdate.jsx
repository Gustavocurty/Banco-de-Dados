import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FormContratoUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    jogadorId: "",
    timeId: "",
    inicio: "",
    fim: "",
  });

  const [jogadores, setJogadores] = useState([]);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    async function fetchContrato() {
      if (!id) return;
      try {
        const res = await fetch(`http://localhost:3333/contract/${id}`);
        if (!res.ok) throw new Error("Contrato não encontrado");
        const contrato = await res.json();
        setFormData({
          jogadorId: contrato.playerId ? String(contrato.playerId) : "",
          timeId: contrato.teamId ? String(contrato.teamId) : "",
          inicio: contrato.startDate ? contrato.startDate.slice(0, 10) : "",
          fim: contrato.endDate ? contrato.endDate.slice(0, 10) : "",
        });
      } catch {
        alert("Erro ao buscar contrato!");
      }
    }

    async function fetchJogadores() {
      try {
        const res = await fetch("http://localhost:3333/player");
        if (res.ok) {
          const data = await res.json();
          setJogadores(data);
        }
      } catch {
        setJogadores([]);
      }
    }

    async function fetchTimes() {
      try {
        const res = await fetch("http://localhost:3333/team");
        if (res.ok) {
          const data = await res.json();
          setTimes(data);
        }
      } catch {
        setTimes([]);
      }
    }

    fetchContrato();
    fetchJogadores();
    fetchTimes();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDateLocalToISO = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      playerId: Number(formData.jogadorId),
      teamId: Number(formData.timeId),
      startDate: formatDateLocalToISO(formData.inicio),
      endDate: formatDateLocalToISO(formData.fim),
    };

    try {
      const res = await fetch(`http://localhost:3333/contract/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Erro ao atualizar contrato: ${error.error || res.statusText}`);
        return;
      }

      navigate("/contratos");
    } catch (error) {
      alert(`Erro na conexão`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-lg bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <h1 className="text-3xl text-white font-bold mb-6">Atualizar Contrato</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="jogadorId">
            Jogador
          </label>
          <select
            id="jogadorId"
            name="jogadorId"
            value={formData.jogadorId}
            onChange={handleChange}
            required
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecione o jogador</option>
            {jogadores.map((jogador) => (
              <option key={jogador.id} value={jogador.id}>
                {jogador.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="timeId">
            Time
          </label>
          <select
            id="timeId"
            name="timeId"
            value={formData.timeId}
            onChange={handleChange}
            required
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecione o time</option>
            {times.map((time) => (
              <option key={time.id} value={time.id}>
                {time.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="inicio">
            Data de Início
          </label>
          <input
            type="date"
            id="inicio"
            name="inicio"
            value={formData.inicio}
            onChange={handleChange}
            required
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="fim">
            Data de Fim
          </label>
          <input
            type="date"
            id="fim"
            name="fim"
            value={formData.fim}
            onChange={handleChange}
            required
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Atualizar Contrato
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => navigate("/contratos")}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
