import fastify from 'fastify'
import { contractController } from './routes/contractController'
import { estatisticController } from './routes/estatisticController'
import { playerController } from './routes/playerController'
import { teamController } from './routes/teamController'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(contractController)

app.register(estatisticController)

app.register(playerController)

app.register(teamController)

app.get('/', () => {
    return 'Meu BD po..'
})


app.listen({port:3333}).then(() => {
    console.log('HTTP server running')
})
