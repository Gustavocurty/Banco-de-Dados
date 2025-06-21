import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormTimeCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Função para evitar erro na data: fixa a hora para 12:00 local, para não alterar o dia
  const formatDateLocalToISO = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;

    const data = {
      name: form.name.value,
      country: form.country.value,
      foundation: formatDateLocalToISO(form.foundation.value),
    };

    try {
      const res = await fetch("http://localhost:3333/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao adicionar time");
      navigate("/times");
    } catch (error) {
      alert(error.message || "Erro ao adicionar time");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-lg bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <h1 className="text-3xl text-white font-bold mb-6">Adicionar Time</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
            Nome do Time
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Digite o nome do time"
            required
            disabled={loading}
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="country">
            País
          </label>
          <input
            type="text"
            id="country"
            name="country"
            placeholder="Digite o país do time"
            required
            disabled={loading}
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="foundation">
            Fundação
          </label>
          <input
            type="date"
            id="foundation"
            name="foundation"
            required
            disabled={loading}
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            Adicionar Time
          </button>
          <button
            type="button"
            onClick={() => navigate("/times")}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
