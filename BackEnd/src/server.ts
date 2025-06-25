import fastify from 'fastify'
import cors from '@fastify/cors'
import { contractController } from './routes/contractController'
import { estatisticController } from './routes/estatisticController'
import { playerController } from './routes/playerController'
import { teamController } from './routes/teamController'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})

app.register(contractController)
app.register(estatisticController)
app.register(playerController)
app.register(teamController)

app.get('/', async () => {
  return 'Meu Banco de dados po..'
})

app.listen({ port: 3333 }).then(() => {
  console.log('Servidor HTTP rodando em http://localhost:3333')
})
