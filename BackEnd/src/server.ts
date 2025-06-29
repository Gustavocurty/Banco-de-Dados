import fastify from 'fastify'
import cors from '@fastify/cors'
import { nacionalidadeController } from './routes/nacionalidadeController'
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

app.addHook('onRequest', (request, reply, done) => {
  console.log(`${request.method} ${request.url}`)
  done()
})

app.setErrorHandler((error, request, reply) => {
  console.error(error)
  reply.status(500).send({ error: 'Erro interno no servidor.' })
})

app.register(nacionalidadeController)
app.register(contractController)
app.register(estatisticController)
app.register(playerController)
app.register(teamController)

app.get('/', async () => {
  return 'Meu Banco de dados...'
})

const PORT = Number(process.env.PORT) || 3333

app.listen({ port: PORT }).then(() => {
  console.log(`Servidor HTTP rodando em http://localhost:${PORT}`)
})
