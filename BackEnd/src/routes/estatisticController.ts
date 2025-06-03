import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const estatisticController: FastifyPluginAsyncZod = async app => {
    const { z } = await import("zod");

    const estatisticSchema = z.object({
        playerId: z.string(),
        teamId: z.string(),
        goals: z.number(),
        assists: z.number(),
        matches: z.number()
    });

    const estatisticResponseSchema = z.object({
        id: z.string(),
        playerId: z.string(),
        teamId: z.string(),
        goals: z.number(),
        assists: z.number(),
        matches: z.number()
    });

    // POST - Criar estatística
    app.post('/estatistic', {
        schema: {
            body: estatisticSchema,
            response: {
                201: estatisticResponseSchema,
                500: z.object({ error: z.string() })
            }
        }
    }, async (request, reply) => {
        const { playerId, teamId, goals, assists, matches } = request.body;

        try {
            const newEstatistic = await prisma.estatistic.create({
                data: {
                    playerId,
                    teamId,
                    goals,
                    assists,
                    matches
                }
            });
            reply.status(201).send(newEstatistic);
        } catch (error) {
            console.log(error)
            reply.status(500).send({ error: 'Erro ao criar estatística!' });
        }
    });

    // GET - Listar estatísticas
    app.get('/estatistic', {
        schema: {
            response: {
                200: z.array(estatisticResponseSchema),
                500: z.object({ error: z.string() })
            }
        }
    }, async (_, reply) => {
        try {
            const estatistics = await prisma.estatistic.findMany();
            reply.send(estatistics);
        } catch (error) {
            reply.status(500).send({ error: 'Erro ao buscar estatísticas.' });
        }
    });

    // PUT - Atualizar estatística
    app.put('/estatistic/:id', {
        schema: {
            params: z.object({ id: z.string() }),
            body: estatisticSchema,
            response: {
                200: estatisticResponseSchema,
                500: z.object({ error: z.string() })
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        const { playerId, teamId, goals, assists, matches } = request.body;

        try {
            const updatedEstatistic = await prisma.estatistic.update({
                where: { id },
                data: {
                    playerId,
                    teamId,
                    goals,
                    assists,
                    matches
                }
            });
            reply.status(200).send(updatedEstatistic);
        } catch (error) {
            reply.status(500).send({ error: 'Erro ao atualizar estatística.' });
        }
    });

    // DELETE - Remover estatística
    app.delete('/estatistic/:id', {
        schema: {
            params: z.object({ id: z.string() }),
            response: {
                200: z.object({ message: z.string() }),
                500: z.object({ error: z.string() })
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;

        try {
            await prisma.estatistic.delete({ where: { id } });
            reply.send({ message: 'Estatística deletada com sucesso!' });
        } catch (error) {
            reply.status(500).send({ error: 'Erro ao deletar estatística.' });
        }
    });
};
