import Nav from './components/nav'
import Home from './pages/home'
import Jogadores from './pages/jogadores'
import { Routes, Route } from "react-router";
import Times from './pages/time';
import Estatisticas from './pages/estatistica';
import Contratos from './pages/contratos';
import FormTimesCreate from './components/formtimecreate';
import FormTimesUpdate from './components/formtimeupdate';
import FormJogadoresCreate from './components/formjogadorcreate';
import FormJogadoresUpdate from './components/formjogadorupdate';

function App() {

  return (
    <div className="flex flex-col min-h-screen bg-white items-center">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/jogadores" element={<Jogadores />} />
        <Route path="/jogadores/criar" element={<FormJogadoresCreate />} />
        <Route path="/jogadores/editar/:id" element={<FormJogadoresUpdate />} />

        <Route path="/times" element={<Times />} />
        <Route path="/times/criar" element={<FormTimesCreate />} />
        <Route path="/times/editar/:id" element={<FormTimesUpdate />} />
        
        <Route path="/estatisticas" element={<Estatisticas />} />
        
        <Route path="/contratos" element={<Contratos />} />
        

      </Routes>
    </div>
  )
}

export default App
