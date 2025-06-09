import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

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
        <div className="flex flex-col items-center justify-center w-[80%] bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
            <div className="flex justify-between items-center w-full mb-5">
            <h1 className="text-3xl text-white font-bold">TIMES</h1>
                <a href="/times/criar" className="bg-white text-black px-4 py-2 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2">
                    <FontAwesomeIcon icon={faAdd} />
                    <p className="font-bold">Adicionar Time</p>

                </a>
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Nome</th>
                        <th className="py-3 px-6 text-left">País</th>
                        <th className="py-3 px-6 text-left">Fundação</th>
                        <th className="py-3 px-6 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {times && times.length > 0 ?
                    times.map((time) => {
                        return(
                            <tr key={time.id} className="border-b text-black border-gray-200 hover:bg-gray-100">
                                <td className="py-1 px-6 text-left">{time.name}</td>
                                <td className="py-1 px-6 text-left">{time.country}</td>
                                <td className="py-1 px-6 text-left">{new Date(time.foundation).toLocaleDateString('pt-BR')}</td>
                                <td className="py-1 px-6 text-right">
                                    <form action="DELETE"></form>
                                    <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors duration-300 mr-2" onClick={async () => {
                                        if (!window.confirm('Tem certeza que deseja excluir este time?')) {
                                            return;
                                        }
                                        try {
                                            const response = await fetch(`http://localhost:3333/team/${time.id}`, {
                                                method: 'DELETE'
                                            });
                                            if (response.ok) {
                                                window.location.reload();
                                            } 
                                        } catch (error) {
                                            console.error('Erro ao excluir o time:', error);
                                            alert('Erro ao excluir o time');
                                        }
                                    }}>
                                        <FontAwesomeIcon icon={faTrash} />

                                    </button>
                                    <a className="bg-blue-500 text-white px-4 py-[6px] rounded hover:bg-blue-700 transition-colors duration-300" href={`/times/editar/${time.id}`}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </a>
                                </td>
                            </tr>
                        );
                    }) :
                        <tr>
                            <td colSpan="4" className="py-3 px-6 text-center text-gray-500">
                                Nenhum time encontrado.
                            </td>
                        </tr>

                    }
                </tbody>
            </table>
            
        </div>
    );
}