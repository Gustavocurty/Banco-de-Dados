import Nav from './components/nav'
import Home from './pages/home'
import Jogadores from './pages/jogadores'
import Times from './pages/times'
import Estatisticas from './pages/estatisticas'
import Contratos from './pages/contratos'
import Nacionalidades from './pages/nacionalidades'
import FormNacionalidadeCreate from './components/formnacionalidadecreate'
import FormNacionalidadeUpdate from './components/formnacionalidadeupdate'
import FormTimesCreate from './components/formtimecreate'
import FormTimesUpdate from './components/formtimeupdate'
import FormJogadoresCreate from './components/formjogadorcreate'
import FormJogadoresUpdate from './components/formjogadorupdate'
import FormEstatisticaCreate from './components/formestatisticacreate'
import FormEstatisticaUpdate from './components/formestatisticaupdate'
import FormContratoCreate from './components/formcontratocreate'
import FormContratoUpdate from './components/formcontratoupdate'

import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white items-center pt-[64px]">
      <Nav/>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/jogadores" element={<Jogadores />} />
        <Route path="/jogadores/criar" element={<FormJogadoresCreate />} />
        <Route path="/jogadores/editar/:id" element={<FormJogadoresUpdate />} />

        <Route path="/times" element={<Times />} />
        <Route path="/times/criar" element={<FormTimesCreate />} />
        <Route path="/times/editar/:id" element={<FormTimesUpdate />} />

        <Route path="/estatisticas" element={<Estatisticas />} />
        <Route path="/estatisticas/criar" element={<FormEstatisticaCreate />} />
        <Route path="/estatisticas/editar/:id" element={<FormEstatisticaUpdate />} />

        <Route path="/contratos" element={<Contratos />} />
        <Route path="/contratos/criar" element={<FormContratoCreate />} />
        <Route path="/contratos/editar/:id" element={<FormContratoUpdate />} />

        <Route path="/nacionalidades" element={<Nacionalidades />} />
        <Route path="/nacionalidades/criar" element={<FormNacionalidadeCreate />} />
        <Route path="/nacionalidades/editar/:id" element={<FormNacionalidadeUpdate />} />
      </Routes>
    </div>
  )
}

export default App
