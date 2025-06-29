import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import { Link } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
registerLocale("ptBR", ptBR);

const positionDisplayMap = {
  GOLEIRO: "Goleiro",
  ZAGUEIRO: "Zagueiro",
  LATERAL_ESQUERDO: "Lateral Esquerdo",
  LATERAL_DIREITO: "Lateral Direito",
  MEIO_CAMPO: "Meio Campo",
  ATACANTE: "Atacante",
};

const positionOptions = [
  { value: "", label: "Todas" },
  { value: "GOLEIRO", label: "Goleiro" },
  { value: "ZAGUEIRO", label: "Zagueiro" },
  { value: "LATERAL_ESQUERDO", label: "Lateral Esquerdo" },
  { value: "LATERAL_DIREITO", label: "Lateral Direito" },
  { value: "MEIO_CAMPO", label: "Meio Campo" },
  { value: "ATACANTE", label: "Atacante" },
];

export default function Player() {
  const [jogadores, setJogadores] = useState([]);
  const [jogadoresSelecionados, setJogadoresSelecionados] = useState([]);
  const [searchJogador, setSearchJogador] = useState("");
  const [searchNacionalidade, setSearchNacionalidade] = useState("");
  const [searchDataNascimento, setSearchDataNascimento] = useState(null);
  const [searchPosicao, setSearchPosicao] = useState("");

  useEffect(() => {
    async function fetchJogadores() {
      try {
        const res = await fetch("http://localhost:3333/player");
        const data = await res.json();
        setJogadores(data);
      } catch (error) {
        console.error("Erro ao buscar os jogadores:", error);
      }
    }
    fetchJogadores();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este jogador?")) return;
    try {
      const response = await fetch(`http://localhost:3333/player/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setJogadores((prev) => prev.filter((j) => j.id !== id));
        setJogadoresSelecionados((prev) => prev.filter((j) => j.id !== id));
      } else {
        alert("Erro ao excluir o jogador");
      }
    } catch (error) {
      console.error("Erro ao excluir o jogador:", error);
      alert("Erro ao excluir o jogador");
    }
  };

  useEffect(() => {
    if (
      !searchJogador &&
      !searchNacionalidade &&
      !searchDataNascimento &&
      !searchPosicao
    ) {
      setJogadoresSelecionados([]);
      return;
    }

    const params = new URLSearchParams();
    if (searchJogador) params.append("q", searchJogador);
    if (searchDataNascimento)
      params.append("birthday", searchDataNascimento.toISOString().split("T")[0]);
    if (searchPosicao) params.append("position", searchPosicao);
    
    if (searchNacionalidade) {
      const filtrado = jogadores.filter((j) =>
        j.nacionalidade?.nome.toLowerCase().includes(searchNacionalidade.toLowerCase())
      );
      setJogadoresSelecionados(filtrado);
      return;
    }

    async function fetchFiltrados() {
      try {
        const res = await fetch(`http://localhost:3333/player?${params.toString()}`);
        const data = await res.json();
        setJogadoresSelecionados(data);
      } catch (error) {
        console.error("Erro ao buscar jogadores", error);
      }
    }

    fetchFiltrados();
  }, [searchJogador, searchNacionalidade, searchDataNascimento, searchPosicao, jogadores]);

  const lista =
    searchJogador || searchNacionalidade || searchDataNascimento || searchPosicao
      ? jogadoresSelecionados
      : jogadores;

  return (
    <div className="flex flex-col items-center justify-center w-[95%] bg-blue-400 p-8 rounded-lg shadow-lg mt-10">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-3xl text-white font-bold">JOGADORES</h1>
        <Link
          to="/jogadores/criar"
          className="bg-white text-black px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faAdd} />
          <p className="font-bold">Adicionar Jogador</p>
        </Link>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">Nome</th>
              <th className="py-3 px-6 text-center">Nacionalidade</th>
              <th className="py-3 px-6 text-center">Nascimento</th>
              <th className="py-3 px-6 text-center">Posição</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
            <tr className="bg-gray-200">
              <th className="py-2 px-6 text-center">
                <input
                  type="text"
                  value={searchJogador}
                  placeholder="Pesquisar Jogador 🔎"
                  onChange={(e) => setSearchJogador(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full text-black placeholder-black text-center py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </th>
              <th className="py-2 px-6 text-center">
                <input
                  type="text"
                  value={searchNacionalidade}
                  placeholder="Pesquisar Nacionalidade 🔎"
                  onChange={(e) => setSearchNacionalidade(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full text-black placeholder-black text-center py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </th>
              <th className="py-2 px-6 text-center">
                <DatePicker
                  selected={searchDataNascimento}
                  onChange={(date) => setSearchDataNascimento(date)}
                  dateFormat="dd/MM/yyyy"
                  locale="ptBR"
                  placeholderText="Pesquisar Nascimento 🔎"
                  className="bg-white border border-gray-300 rounded-lg w-full min-w-[120px] text-black placeholder-black py-1 px-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition mx-auto block"
                  isClearable
                />
              </th>
              <th className="py-2 px-6 text-center">
                <select
                  value={searchPosicao}
                  onChange={(e) => setSearchPosicao(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full text-black text-center py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer"
                >
                  {positionOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 px-6 text-center text-gray-500 font-semibold bg-gray-50">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              lista.map((jogador) => (
                <tr
                  key={jogador.id}
                  className="border-b text-black border-gray-200 hover:bg-blue-100 transition-colors duration-200"
                >
                  <td className="py-2 px-6 text-center whitespace-nowrap font-medium">{jogador.name}</td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">{jogador.nacionalidade?.nome || "—"}</td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {new Date(jogador.birthday).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {positionDisplayMap[jogador.position] || jogador.position}
                  </td>
                  <td className="py-2 px-6 text-right whitespace-nowrap flex gap-2 justify-end">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 mr-2 shadow-md hover:scale-105"
                      onClick={() => handleDelete(jogador.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <Link
                      to={`/jogadores/editar/${jogador.id}`}
                      className="bg-blue-500 text-white px-4 py-[6px] rounded hover:bg-blue-700 transition-colors duration-300 shadow-md hover:scale-105"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
