import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FormTimeUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    foundation: ""
  });

  useEffect(() => {
    if (!id) return;

    async function fetchTeam() {
      try {
        const res = await fetch(`http://localhost:3333/team/${id}`);
        if (!res.ok) {
          alert("Time não encontrado!");
          return;
        }
        const team = await res.json();
        setFormData({
          name: team.name || "",
          country: team.country || "",
          foundation: team.foundation ? team.foundation.slice(0, 10) : ""
        });
      } catch (error) {
        alert("Erro ao buscar time!");
      }
    }

    fetchTeam();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
      name: formData.name,
      country: formData.country,
      foundation: formatDateLocalToISO(formData.foundation),
    };

    try {
      const res = await fetch(`http://localhost:3333/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert("Erro ao atualizar time!");
        return;
      }

      navigate("/times");
    } catch (error) {
      alert("Erro ao atualizar time!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-lg bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
      <h1 className="text-3xl text-white font-bold mb-6">Atualizar Time</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
            Nome do Time
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white"
            placeholder="Nome do time"
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
            value={formData.country}
            onChange={handleChange}
            required
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white"
            placeholder="País do time"
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
            value={formData.foundation}
            onChange={handleChange}
            required
            className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            Atualizar Time
          </button>
          <button
            type="button"
            onClick={() => navigate("/times")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
