import { User, Trophy, BarChart3, FileText} from 'lucide-react'
import './App.css'

function App() {

  return (
    <>
      <div className="w-screen h-screen bg-blue-100 p-5">
        <div className='flex flex-col items-center'>
          <p className='text-3xl font-bold text-black'> ⚽ Sistema de Gestão de Futebol</p>
          <p className='text-xl text-black'> Gerencie seu time aqui!</p>
        </div>
        <div>
          <div className='flex justify-around p-7'>
            <div className='flex gap-x-2 '>
              <User color='black' />
              <p className='text-black font-bold'>Jogadores</p>
            </div>
            <div className='flex gap-x-2'>
              <Trophy color='black' />
              <p className='text-black font-bold'>Times</p>
            </div>
            <div className='flex gap-x-2'>
              <BarChart3 color='black' />
              <p className='text-black font-bold'>Estatísticas</p>
            </div>
            <div className='flex gap-x-2'>
              <FileText color='black' />
              <p className='text-black font-bold'>Contratos</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
