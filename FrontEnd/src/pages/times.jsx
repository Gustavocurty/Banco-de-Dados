import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import { Link } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
registerLocale("ptBR", ptBR);

export default function Times() {
  const [times, setTimes] = useState([]);
  const [filteredTimes, setFilteredTimes] = useState([]);
  const [searchTime, setSearchTime] = useState("");
  const [searchPais, setSearchPais] = useState("");
  const [searchFundacao, setSearchFundacao] = useState("");

  const fetchTimes = async (queryParams = "") => {
    try {
      const res = await fetch(`http://localhost:3333/team${queryParams}`);
      const data = await res.json();
      setTimes(data);
      setFilteredTimes(data);
    } catch (error) {
      console.error("Erro ao buscar os times:", error);
    }
  };

  useEffect(() => {
    fetchTimes();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTime.trim() !== "") params.append("q", searchTime);
    if (searchPais.trim() !== "") params.append("country", searchPais);
    if (searchFundacao.trim() !== "") params.append("foundation", searchFundacao);

    const query = params.toString() ? `?${params.toString()}` : "";
    fetchTimes(query);
  }, [searchTime, searchPais, searchFundacao]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este time?")) return;

    try {
      const response = await fetch(`http://localhost:3333/team/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTimes((prev) => prev.filter((time) => time.id !== id));
        setFilteredTimes((prev) => prev.filter((time) => time.id !== id));
      } else {
        alert("Erro ao excluir o time");
      }
    } catch (error) {
      console.error("Erro ao excluir o time:", error);
      alert("Erro ao excluir o time");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-[95%] bg-blue-400 p-8 rounded-lg shadow-lg mt-10">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-3xl text-white font-bold">TIMES</h1>
        <Link
          to="/times/criar"
          className="bg-white text-black px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faAdd} />
          <p className="font-bold">Adicionar Time</p>
        </Link>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">Nome</th>
              <th className="py-3 px-6 text-center">País</th>
              <th className="py-3 px-6 text-center">Fundação</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
            <tr className="bg-gray-200">
              <th className="py-2 px-6 text-center">
                <input
                  type="text"
                  value={searchTime}
                  placeholder="Pesquisar Time 🔎"
                  onChange={(e) => setSearchTime(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full !text-black placeholder-black text-center py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </th>
              <th className="py-2 px-6 text-center">
                <input
                  type="text"
                  value={searchPais}
                  placeholder="Pesquisar País 🔎"
                  onChange={(e) => setSearchPais(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg w-full !text-black placeholder-black text-center py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </th>
              <th className="py-2 px-6 text-center">
                <DatePicker
                  selected={searchFundacao ? new Date(searchFundacao) : null}
                  onChange={(date) => {
                    if (date) setSearchFundacao(date.toISOString().split("T")[0]);
                    else setSearchFundacao("");
                  }}
                  dateFormat="dd/MM/yyyy"
                  locale="ptBR"
                  placeholderText="Data da Fundação 🔎"
                  className="bg-white border text-center border-gray-300 rounded-lg w-full min-w-[120px] !text-black placeholder-black py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition mx-auto block"
                  isClearable
                />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredTimes.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 px-6 text-center text-gray-500 font-semibold bg-gray-50">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              filteredTimes.map((time) => (
                <tr
                  key={time.id}
                  className="border-b text-black border-gray-200 hover:bg-blue-100 transition-colors duration-200"
                >
                  <td className="py-2 px-6 text-center whitespace-nowrap font-medium">{time.name}</td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">{time.country}</td>
                  <td className="py-2 px-6 text-center whitespace-nowrap">
                    {new Date(time.foundation).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-2 px-6 text-right whitespace-nowrap flex gap-2 justify-end">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 shadow-md hover:scale-105"
                      onClick={() => handleDelete(time.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <Link
                      className="bg-blue-500 text-white px-4 py-[6px] rounded hover:bg-blue-700 transition-colors duration-300 shadow-md hover:scale-105"
                      to={`/times/editar/${time.id}`}
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
