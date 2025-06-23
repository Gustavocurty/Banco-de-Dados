import React from "react";


export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center text-center w-xg bg-blue-400 p-8 rounded-lg shadow-lg mt-30">
            <h1 className="text-3xl text-white font-bold mb-6">Bem-vindo ao Gerenciador Jogadores de Futebol</h1>
            <p className="text-white text-center text-lg">
                Aqui você pode gerenciar jogadores, times, contratos e estatísticas de forma fácil e rápida.
            </p>
            <p className="text-white text-center text-lg mt-4">
                Use o menu para navegar entre as diferentes seções e comece a gerenciar seus jogadores hoje mesmo!
            </p>
        </div>
    );
}