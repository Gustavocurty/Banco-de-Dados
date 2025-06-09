import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormJogadorCreate() {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        // Buscar times para o select
        async function fetchTeams() {
            try {
                const res = await fetch('http://localhost:3333/team');
                const data = await res.json();
                setTeams(data);
            } catch {
                setTeams([]);
            }
        }
        fetchTeams();
    }, []);

    return (
        // alinhar ao centro
        <div className="flex flex-col items-center justify-center w-lg bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
            <h1 className="text-3xl text-white font-bold mb-6">Adicionar Jogador</h1>
            <form action="POST" method="POST" className="w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
                        Nome do Jogador
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Digite o nome do jogador"
                        required
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="country">
                        Nacionalidade
                    </label>
                    <input
                        type="text"
                        id="country"
                        placeholder="Digite a nacionalidade do jogador"
                        name="country"
                        required
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="position">
                        Posição
                    </label>
                    <input
                        type="text"
                        id="position"
                        name="position"
                        placeholder="Digite a posição do jogador"
                        required
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="birthdate">
                        Data de Nascimento
                    </label>
                    <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        required
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="teamId">
                        Time
                    </label>
                    <select
                        id="teamId"
                        name="teamId"
                        required
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Selecione o time</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-green-500 cursor-pointer hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                        onClick={
                            async (e) => {
                                e.preventDefault();
                                const form = e.target.form;
                                const data = {
                                    name: form.name.value,
                                    nationality: form.country.value,
                                    birthday: form.birthdate.value,
                                    position: form.position.value,
                                    teamId: form.teamId.value
                                };
                                await fetch('http://localhost:3333/player', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(data)
                                });
                                navigate('/jogadores');
                            }
                        }>
                        Adicionar jogador
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 cursor-pointer" onClick={() => navigate('/jogadores')}>
                        Voltar
                    </button>
                </div>
            </form>
        </div>
    );
}