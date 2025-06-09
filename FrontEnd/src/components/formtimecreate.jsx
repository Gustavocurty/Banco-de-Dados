import React from "react";
import { useNavigate } from "react-router-dom";

export default function FormTimeCreate() {
    const navigate = useNavigate();

    return (
        // alinhar ao centro
        <div className="flex flex-col items-center justify-center w-lg bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
            <h1 className="text-3xl text-white font-bold mb-6">Adicionar Time</h1>
            <form action="POST" method="POST" className="w-full max-w-md">
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
                        placeholder="Digite o país do time"
                        name="country"
                        required
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
                        className="shadow border-none appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                    />
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
                                    country: form.country.value,
                                    foundation: form.foundation.value
                                };
                                await fetch('http://localhost:3333/team', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(data)
                                });
                                navigate('/times');
                            }
                        }>
                        Adicionar Time
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 cursor-pointer" onClick={() => navigate('/times')}>
                        Voltar
                    </button>
                </div>
            </form>
        </div>
    );
}