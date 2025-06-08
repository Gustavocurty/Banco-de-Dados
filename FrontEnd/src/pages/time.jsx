import React, { useEffect, useState } from "react";

export default function Times() {


    const [times, setTimes] = useState([])

    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const res = await fetch('http://localhost:3333/team')
                const data = await res.json()
                setTimes(data)
            } catch (error) {
                console.error('Erro ao buscar os times:', error)
            }
        }

        fetchTimes()
    }, [])

    console.log(times)


    return (
        // listar times, ao lado tera botao de excluir, editar
        <div className="flex flex-col items-center justify-center w-[80%] bg-blue-400 p-8 rounded-lg shadow-lg mt-10">
            <h1 className="text-3xl text-white font-bold mb-6">TIMES</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Nome</th>
                        <th className="py-3 px-6 text-left">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {times && times.length > 0 ?
                    times.map((time) => {
                        return(
                            <tr key={time.id} className="border-b text-black border-gray-200 hover:bg-gray-100">
                                <td className="py-1 px-6 text-left">{time.name}</td>
                                <td className="py-1 px-6 text-left">
                                    <form action="DELETE"></form>
                                    <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 mr-2" onClick={async () => {
                                        try {
                                            const response = await fetch(`http://localhost:3333/team/${time.id}`, {
                                                method: 'DELETE'
                                            });
                                            if (response.ok) {
                                                alert('Time excluído com sucesso');
                                                window.location.reload();
                                            } else {
                                                alert('Erro ao excluir o time');
                                            }
                                        } catch (error) {
                                            console.error('Erro ao excluir o time:', error);
                                            alert('Erro ao excluir o time');
                                        }
                                    }}>
                                        Excluir
                                    </button>
                                    <a className="bg-blue-500 text-white px-4 py-[6px] rounded hover:bg-blue-700 transition-colors duration-300" href={`/times/editar/${time.id}`}>
                                        Editar
                                    </a>
                                </td>
                            </tr>
                        );
                    }) :
                        <tr>
                            <td colSpan="2" className="py-3 px-6 text-center text-gray-500">
                                Nenhum time encontrado.
                            </td>
                        </tr>

                    }
                </tbody>
            </table>
            <div className="mt-6">
                <a href="/times/criar" className="bg-white text-black px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 cursor-pointer">
                    Adicionar Time
                </a>
            </div>
        </div>
    );
}