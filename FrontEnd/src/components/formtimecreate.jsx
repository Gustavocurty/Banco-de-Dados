import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormTimeCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    foundation: "",
    nacionalidadeId: "",
  });
  const [nacionalidades, setNacionalidades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNacionalidades() {
      try {
        const res = await fetch("http://localhost:3333/nacionalidades");
        if (!res.ok) throw new Error("Erro ao carregar nacionalidades");
        const data = await res.json();
        setNacionalidades(data);
      } catch (err) {
        alert(err.message);
      }
    }
    fetchNacionalidades();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fixDateToISO = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const nacionalidadeSelecionada = nacionalidades.find(
        (n) => n.id === Number(formData.nacionalidadeId)
      );

      const payload = {
        name: formData.name.trim(),
        foundation: fixDateToISO(formData.foundation),
        nacionalidadeId: Number(formData.nacionalidadeId),
        country: nacionalidadeSelecionada ? nacionalidadeSelecionada.nome : "",
      };

      const res = await fetch("http://localhost:3333/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao criar time");
      }

      navigate("/times");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-lg w-full bg-blue-400 p-8 rounded-lg shadow-lg mt-10 mx-auto">
      <h1 className="text-3xl text-white font-bold mb-6">Criar Novo Time</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label htmlFor="name" className="block text-white font-bold mb-2">
            Nome do Time
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-white text-black w-full rounded py-2 px-3"
            placeholder="Nome do time"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="foundation" className="block text-white font-bold mb-2">
            Fundação
          </label>
          <input
            type="date"
            id="foundation"
            name="foundation"
            value={formData.foundation}
            onChange={handleChange}
            required
            className="bg-white text-black w-full rounded py-2 px-3"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="nacionalidadeId" className="block text-white font-bold mb-2">
            Nacionalidade
          </label>
          <select
            id="nacionalidadeId"
            name="nacionalidadeId"
            value={formData.nacionalidadeId}
            onChange={handleChange}
            required
            className="bg-white text-black w-full rounded py-2 px-3"
          >
            <option value="">Selecione uma nacionalidade</option>
            {nacionalidades.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Adicionar Time
          </button>
          <button
            type="button"
            onClick={() => navigate("/times")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
