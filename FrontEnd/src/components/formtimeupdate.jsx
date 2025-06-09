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
        async function fetchAndFilterTeam() {
            if (!id) return;
            const res = await fetch('http://localhost:3333/team');
            if (res.ok) {
                const teams = await res.json();
                const team = teams.find(t => String(t.id) === String(id));
                if (team) {
                    setFormData({
                        name: team.name || "",
                        country: team.country || "",
                        foundation: team.foundation ? team.foundation.slice(0, 10) : ""
                    });
                } else {
                    alert('Time não encontrado!');
                }
            } else {
                alert('Erro ao buscar times!');
            }
        }
        fetchAndFilterTeam();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col items-center justify-center w-lg bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
            <h1 className="text-3xl text-white font-bold mb-6">Atualizar Time</h1>
            <form className="w-full max-w-md">
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
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="country">
                        País
                    </label>
                    <input
                        type="text"
                        id="country"
                        placeholder="Digite o país do time"
                        name="country"
                        required
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.country}
                        onChange={handleChange}
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
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.foundation}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                        onClick={
                            async (e) => {
                                e.preventDefault();
                                await fetch(`http://localhost:3333/team/${id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(formData)
                                });
                                //espera 1 segundo para garantir que a atualização foi concluída
                                navigate('/times');
                            }
                        }>
                        Atualizar Time
                    </button>

                    <button type="submit" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 cursor-pointer" onClick={() => navigate('/times')}>
                            Voltar
                    </button>
                </div>
            </form>
        </div>
    );
}