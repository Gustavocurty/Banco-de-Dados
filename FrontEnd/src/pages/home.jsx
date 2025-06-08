import React from "react";


export default function Home() {
    return (
        
        // quero uma pagina inicial com um titulo e um texto de boas vindas
        <div className="flex flex-col items-center justify-center w-[80%] bg-blue-400 p-8 rounded-lg shadow-lg mt-10">
            <h1 className="text-3xl text-white font-bold mb-6">Bem-vindo ao Gerenciador de Futebol</h1>
            <p className="text-white text-lg">
                Aqui você pode gerenciar jogadores, times, contratos e estatísticas de forma fácil e rápida.
            </p>
            <p className="text-white text-lg mt-4">
                Use o menu para navegar entre as diferentes seções e comece a gerenciar seu time de futebol hoje mesmo!
            </p>
        </div>
    );
    }