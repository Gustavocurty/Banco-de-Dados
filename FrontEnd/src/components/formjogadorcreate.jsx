import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormJogadorCreate() {
  const navigate = useNavigate();
  const [nacionalidades, setNacionalidades] = useState([]);
  const [positions] = useState([
    "GOLEIRO",
    "ZAGUEIRO",
    "LATERAL_ESQUERDO",
    "LATERAL_DIREITO",
    "MEIO_CAMPO",
    "ATACANTE"
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3333/nacionalidades");
        const data = await res.json();
        setNacionalidades(data);
      } catch (err) {
        alert("Erro ao carregar nacionalidades!");
      }
    }
    fetchData();
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
      name: form.name.value.trim(),
      birthday: formatDateLocalToISO(form.birthdate.value),
      position: form.position.value,
      nacionalidadeId: Number(form.nacionalidadeId.value)
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
    <div className="flex flex-col items-center justify-center max-w-lg w-full bg-blue-400 p-8 rounded-lg shadow-lg mt-10 mx-auto">
      <h1 className="text-3xl text-white font-bold mb-6">Adicionar Jogador</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-white font-bold mb-2">Nome do Jogador</label>
          <input type="text" name="name" required className="w-full p-2 rounded bg-white text-black" />
        </div>

        <div className="mb-4">
          <label htmlFor="nacionalidadeId" className="block text-white font-bold mb-2">Nacionalidade</label>
          <select name="nacionalidadeId" required className="w-full p-2 rounded bg-white text-black">
            <option value="">Selecione</option>
            {nacionalidades.map((n) => (
              <option key={n.id} value={n.id}>{n.nome}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="position" className="block text-white font-bold mb-2">Posição</label>
          <select name="position" required className="w-full p-2 rounded bg-white text-black">
            <option value="">Selecione</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>{pos.replace("_", " ")}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="birthdate" className="block text-white font-bold mb-2">Data de Nascimento</label>
          <input type="date" name="birthdate" required className="w-full p-2 rounded bg-white text-black" />
        </div>

        <div className="flex justify-between">
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Adicionar Jogador
          </button>
          <button type="button" onClick={() => navigate("/jogadores")} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
