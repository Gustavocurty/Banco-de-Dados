import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const playerController: FastifyPluginAsyncZod = async app => {
    const { z } = await import("zod");

    const playerSchema = z.object({
        name: z.string(),
        birthday: z.string(),
        nationality: z.string(),
        position: z.string(),
        teamId: z.string().optional()
    });

    const playerResponseSchema = z.object({
        id: z.string(),
        name: z.string(),
        birthday: z.string(),
        nationality: z.string(),
        position: z.string(),
        teamId: z.string().nullable()
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
            response: {
                200: z.array(playerResponseSchema),
                500: z.object({ error: z.string() })
            }
        }
    }, async (_, reply) => {
        try {
            const players = await prisma.player.findMany();
            reply.send(players);
        } catch (error) {
            console.error(error);
            reply.status(500).send({ error: 'Erro ao buscar jogadores.' });
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
                where: { id },
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
            await prisma.player.delete({ where: { id } });
            reply.send({ message: 'Jogador deletado com sucesso!' });
        } catch (error) {
            console.error(error);
            reply.status(500).send({ error: 'Erro ao deletar jogador.' });
        }
    });
};
