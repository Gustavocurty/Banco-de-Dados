import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FormJogadorUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nome: "",
    nacionalidade: "",
    nascimento: "",
    posicao: "",
    timeId: "",
  });

  const [times, setTimes] = useState([]);

  useEffect(() => {
    async function fetchJogador() {
      if (!id) return;
      try {
        const res = await fetch(`http://localhost:3333/player/${id}`);
        if (!res.ok) {
          alert("Erro ao buscar jogador!");
          return;
        }
        const jogador = await res.json();

        setFormData({
          nome: jogador.name || "",
          nacionalidade: jogador.nationality || "",
          nascimento: jogador.birthday ? jogador.birthday.slice(0, 10) : "",
          posicao: jogador.position || "",
          timeId: jogador.teamId ? String(jogador.teamId) : "",
        });
      } catch {
        alert("Erro na conexão ao buscar jogador!");
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

    fetchTimes();
    fetchJogador();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para evitar erro na data: fixa a hora para 12:00 local, para não alterar o dia
  const formatDateLocalToISO = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.nome,
      nationality: formData.nacionalidade,
      birthday: formatDateLocalToISO(formData.nascimento),
      position: formData.posicao,
      teamId: Number(formData.timeId),
    };

    try {
      const res = await fetch(`http://localhost:3333/player/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Erro ao atualizar jogador: ${errorData.message || res.statusText}`);
        return;
      }

      navigate("/jogadores");
    } catch (error) {
      alert(`Erro na conexão: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-lg bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <h1 className="text-3xl text-white font-bold mb-6">Atualizar Jogador</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="nome"
          >
            Nome do Jogador
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Digite o nome do jogador"
            required
            value={formData.nome}
            onChange={handleChange}
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="nacionalidade"
          >
            Nacionalidade
          </label>
          <input
            type="text"
            id="nacionalidade"
            name="nacionalidade"
            placeholder="Digite a nacionalidade do jogador"
            required
            value={formData.nacionalidade}
            onChange={handleChange}
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="posicao"
          >
            Posição
          </label>
          <input
            type="text"
            id="posicao"
            name="posicao"
            placeholder="Digite a posição do jogador"
            required
            value={formData.posicao}
            onChange={handleChange}
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="nascimento"
          >
            Data de Nascimento
          </label>
          <input
            type="date"
            id="nascimento"
            name="nascimento"
            required
            value={formData.nascimento}
            onChange={handleChange}
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="timeId"
          >
            Time
          </label>
          <select
            id="timeId"
            name="timeId"
            required
            value={formData.timeId}
            onChange={handleChange}
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecione o time</option>
            {times.map((time) => (
              <option key={time.id} value={time.id}>
                {time.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 cursor-pointer hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            Atualizar jogador
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
