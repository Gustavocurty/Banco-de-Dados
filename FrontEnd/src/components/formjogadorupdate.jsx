import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FormJogadorUpdate() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nome: "",
        nacionalidade: "",
        nascimento: "",
        posicao: "",
        timeId: ""
    });
    const [times, setTimes] = useState([]);

    useEffect(() => {
        async function fetchAndFilterJogador() {
            if (!id) return;
            const res = await fetch(`http://localhost:3333/player`);
            if (res.ok) {
                const jogadores = await res.json();
                const jogador = jogadores.find(j => String(j.id) === String(id));
                if (jogador) {
                    setFormData({
                        nome: jogador.name || "",
                        nacionalidade: jogador.nationality || "",
                        nascimento: jogador.birthday ? jogador.birthday.slice(0, 10) : "",
                        posicao: jogador.position || "",
                        timeId: jogador.teamId || ""
                    });
                } else {
                    alert('Jogador não encontrado!');
                }
            } else {
                alert('Erro ao buscar jogadores!');
            }
        }
        async function fetchTimes() {
            const res = await fetch('http://localhost:3333/team');
            if (res.ok) {
                const data = await res.json();
                setTimes(data);
            }
        }
        fetchTimes();
        fetchAndFilterJogador();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Mapeia os campos para o formato esperado pelo backend
        const payload = {
            name: formData.nome,
            nationality: formData.nacionalidade,
            birthday: formData.nascimento,
            position: formData.posicao,
            teamId: formData.timeId
        };
        await fetch(`http://localhost:3333/player/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        navigate('/jogadores');
    };

    return (
        <div className="flex flex-col items-center justify-center w-lg bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
            <h1 className="text-3xl text-white font-bold mb-6">Atualizar Jogador</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="nome">
                        Nome do Jogador
                    </label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        placeholder="Digite o nome do jogador"
                        required
                        value={formData.nome}
                        onChange={handleChange}
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="nacionalidade">
                        Nacionalidade
                    </label>
                    <input
                        type="text"
                        id="nacionalidade"
                        name="nacionalidade"
                        placeholder="Digite a nacionalidade do jogador"
                        required
                        value={formData.nacionalidade}
                        onChange={handleChange}
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="posicao">
                        Posição
                    </label>
                    <input
                        type="text"
                        id="posicao"
                        name="posicao"
                        placeholder="Digite a posição do jogador"
                        required
                        value={formData.posicao}
                        onChange={handleChange}
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black placeholder-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="nascimento">
                        Data de Nascimento
                    </label>
                    <input
                        type="date"
                        id="nascimento"
                        name="nascimento"
                        required
                        value={formData.nascimento}
                        onChange={handleChange}
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="timeId">
                        Time
                    </label>
                    <select
                        id="timeId"
                        name="timeId"
                        required
                        value={formData.timeId}
                        onChange={handleChange}
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Selecione o time</option>
                        {times.map(time => (
                            <option key={time.id} value={time.id}>{time.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-green-500 cursor-pointer hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                    >
                        Atualizar jogador
                    </button>
                    <button type="button" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 cursor-pointer" onClick={() => navigate('/jogadores')}>
                        Voltar
                    </button>
                </div>
            </form>
        </div>
    );
}