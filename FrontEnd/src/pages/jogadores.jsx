import React from "react";

export default function Jogadores() {

    const jogadores = async () => {
        const response = await fetch("http://localhost:3333/player");
        if (!response.ok) {
            throw new Error("Erro ao buscar jogadores");
        }
        return response.json();
    }

    return (
        // listar jogadores, ao lado tera botao de excluir, editar
        <div className="flex flex-col items-center justify-center w-[80%] bg-blue-400 p-8 rounded-lg shadow-lg mt-10">
            <h1 className="text-3xl text-white font-bold mb-6">JOGADORES</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Nome</th>
                        <th className="py-3 px-6 text-left">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {jogadores && jogadores.length > 0 ?
                    jogadores.map((jogador) => {
                        return(
                            <tr key={jogador.id} className="border-b text-black border-gray-200 hover:bg-gray-100">
                                <td className="py-1 px-6 text-left">{jogador.name}</td>
                                <td className="py-1 px-6 text-left">
                                    <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 mr-2">
                                        Excluir
                                    </button>
                                    <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors duration-300">
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        );
                    }) :
                        <tr>
                            <td colSpan="2" className="py-3 px-6 text-center text-gray-500">
                                Nenhum jogador encontrado.
                            </td>
                        </tr>

                    }
                </tbody>
            </table>
            <div className="mt-6">
                <a href="/jogadores/criar" className="bg-white text-black px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 cursor-pointer">
                    Adicionar Jogador
                </a>
            </div>
        </div>
    );
}