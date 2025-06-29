import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FormJogadorUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    nacionalidadeId: "",
    position: "",
  });

  const [nacionalidades, setNacionalidades] = useState([]);
  const [posicoes] = useState([
    "GOLEIRO",
    "ZAGUEIRO",
    "LATERAL_ESQUERDO",
    "LATERAL_DIREITO",
    "MEIO_CAMPO",
    "ATACANTE",
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:3333/player/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar jogador!");
        const jogador = await res.json();
        setFormData({
          name: jogador.name || "",
          birthday: jogador.birthday ? jogador.birthday.slice(0, 10) : "",
          nacionalidadeId: jogador.nacionalidadeId || "",
          position: jogador.position || "",
        });

        const resNac = await fetch("http://localhost:3333/nacionalidades");
        const dataNac = await resNac.json();
        setNacionalidades(Array.isArray(dataNac) ? dataNac : []);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        alert("Erro ao buscar dados para o formulário.");
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDateLocalToISO = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day), 12);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      birthday: formatDateLocalToISO(formData.birthday),
      nacionalidadeId: Number(formData.nacionalidadeId),
      position: formData.position,
    };

    try {
      const res = await fetch(`http://localhost:3333/player/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Erro ao atualizar jogador: ${errorData.error || res.statusText}`);
        return;
      }

      navigate("/jogadores");
    } catch (err) {
      console.error("Erro ao enviar atualização:", err);
      alert("Erro ao atualizar jogador.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-lg w-full bg-blue-400 p-8 rounded-lg shadow-lg mt-30 mx-auto">
      <h1 className="text-3xl text-white font-bold mb-6">Atualizar Jogador</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-white text-sm font-bold mb-2">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="nacionalidadeId" className="block text-white text-sm font-bold mb-2">Nacionalidade</label>
          <select
            id="nacionalidadeId"
            name="nacionalidadeId"
            required
            value={formData.nacionalidadeId}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none"
          >
            <option value="">Selecione...</option>
            {nacionalidades.map((nac) => (
              <option key={nac.id} value={nac.id}>{nac.nome}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="birthday" className="block text-white text-sm font-bold mb-2">Data de Nascimento</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            required
            value={formData.birthday}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="position" className="block text-white text-sm font-bold mb-2">Posição</label>
          <select
            id="position"
            name="position"
            required
            value={formData.position}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none"
          >
            <option value="">Selecione...</option>
            {posicoes.map((p) => (
              <option key={p} value={p}>{p.replace("_", " ")}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Atualizar Jogador
          </button>
          <button
            type="button"
            onClick={() => navigate("/jogadores")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
