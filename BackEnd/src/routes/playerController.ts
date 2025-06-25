import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const playerController: FastifyPluginAsyncZod = async app => {
    const { z } = await import("zod");

    const playerSchema = z.object({
        name: z.string(),
        birthday: z.string(),
        nationality: z.string(),
        position: z.string(),
        teamId: z.number().optional()
    });

    const playerResponseSchema = z.object({
        id: z.number(),
        name: z.string(),
        birthday: z.string(),
        nationality: z.string(),
        position: z.string(),
        teamId: z.number().nullable()
    });

    // POST - Criar player
    app.post('/player', {
        schema: {
            body: playerSchema,
            response: {
                201: playerResponseSchema,
                500: z.object({ error: z.string() })
            }
        }
    }, async (request, reply) => {
        const { name, birthday, nationality, position, teamId } = request.body;

        try {
            const newPlayer = await prisma.player.create({
                data: {
                    name,
                    birthday,
                    nationality,
                    position,
                    teamId
                }
            });
            reply.status(201).send(newPlayer);
        } catch (error) {
            console.error(error);
            reply.status(500).send({ error: 'Erro ao criar jogador!' });
        }
    });

    // GET - Listar todos os players
    app.get('/player', {
        schema: {
            querystring: z.object({
                q: z.string().optional()
            }),
            response: {
                200: z.array(playerResponseSchema),
                500: z.object({ error: z.string() })
            }
        }
    }, async (request, reply) => {
        const { q } = request.query as { q?: string };
        console.log('Query jogador:', q);

        try {
            const players = await prisma.player.findMany({
                where: q ? {
                    name: {
                        contains: q,
                    }
                }
                : undefined,
                orderBy: {
                    name: 'asc' // ordena por nome
                }
            })
            reply.send(players);
        } catch (error) {
            console.error(error);
            reply.status(500).send({ error: 'Erro ao buscar jogadores.' });
        }
    });

    // GET - Buscar player por ID
    app.get('/player/:id', {
        schema: {
            params: z.object({ id: z.string() }),
            response: {
                200: playerResponseSchema,
                404: z.object({ error: z.string() }),
                500: z.object({ error: z.string() })
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        try {
            const player = await prisma.player.findUnique({
                where: { id: Number(id) }
            });
            if (!player) {
                reply.status(404).send({ error: 'Jogador não encontrado.' });
                return;
            }
            reply.send(player);
        } catch (error) {
            console.error(error);
            reply.status(500).send({ error: 'Erro ao buscar jogador.' });
        }
    });

    // PUT - Atualizar player
    app.put('/player/:id', {
        schema: {
            params: z.object({ id: z.string() }),
            body: playerSchema,
            response: {
                200: playerResponseSchema,
                500: z.object({ error: z.string() })
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        const { name, birthday, nationality, position, teamId } = request.body;

        try {
            const updatedPlayer = await prisma.player.update({
                where: { id: Number(id) },
                data: {
                    name,
                    birthday,
                    nationality,
                    position,
                    teamId
                }
            });
            reply.status(200).send(updatedPlayer);
        } catch (error) {
            console.error(error);
            reply.status(500).send({ error: 'Erro ao atualizar jogador.' });
        }
    });

    // DELETE - Remover player
    app.delete('/player/:id', {
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
            await prisma.player.delete({ where: { id: Number(id) } });
            reply.send({ message: 'Jogador deletado com sucesso!' });
        } catch (error) {
            console.error(error);
            reply.status(500).send({ error: 'Erro ao deletar jogador.' });
        }
    });
};
