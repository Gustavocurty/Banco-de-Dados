import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormJogadorCreate() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
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
    const form = e.target;

    const data = {
      name: form.name.value,
      nationality: form.country.value,
      birthday: formatDateLocalToISO(form.birthdate.value),
      position: form.position.value,
      teamId: Number(form.teamId.value),
    };

    try {
      const res = await fetch("http://localhost:3333/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Erro ao adicionar jogador: ${errorData.message || res.statusText}`);
        return;
      }

      navigate("/jogadores");
    } catch (error) {
      alert(`Erro na conexão: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-lg bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <h1 className="text-3xl text-white font-bold mb-6">Adicionar Jogador</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="name"
          >
            Nome do Jogador
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Digite o nome do jogador"
            required
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="country"
          >
            Nacionalidade
          </label>
          <input
            type="text"
            id="country"
            name="country"
            placeholder="Digite a nacionalidade do jogador"
            required
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="position"
          >
            Posição
          </label>
          <input
            type="text"
            id="position"
            name="position"
            placeholder="Digite a posição do jogador"
            required
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="birthdate"
          >
            Data de Nascimento
          </label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            required
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          />
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

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 cursor-pointer hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            Adicionar jogador
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 cursor-pointer"
            onClick={() => navigate("/jogadores")}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
