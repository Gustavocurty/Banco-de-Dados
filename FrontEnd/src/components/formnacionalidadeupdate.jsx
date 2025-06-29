import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FormNacionalidadeUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNacionalidade() {
      if (!id) return;
      try {
        const res = await fetch(`http://localhost:3333/nacionalidades/${id}`);
        if (!res.ok) throw new Error("Nacionalidade não encontrada");
        const data = await res.json();
        setNome(data.nome);
      } catch (error) {
        alert(error.message);
      }
    }
    fetchNacionalidade();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3333/nacionalidades/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome }),
      });

      const data = await res.json();
      console.log("Atualizado:", data);

      if (!res.ok) {
        throw new Error(data.error || "Erro ao atualizar nacionalidade");
      }

      navigate("/nacionalidades");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-lg w-full bg-blue-400 p-8 rounded-lg shadow-lg mt-10 mx-auto">
      <h1 className="text-3xl text-white font-bold mb-6">Atualizar Nacionalidade</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <label htmlFor="nome" className="block text-white text-sm font-bold mb-2">
          Nome do País
        </label>
        <input
          id="nome"
          type="text"
          placeholder="Nome do país"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={loading}
          required
          className="shadow appearance-none rounded w-full py-2 px-3 text-black bg-white focus:outline-none focus:shadow-outline mb-4"
        />

        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Atualizar Nacionalidade
          </button>
          <button
            type="button"
            onClick={() => navigate("/nacionalidades")}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
