import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const estatisticController: FastifyPluginAsyncZod = async app => {
  const { z } = await import("zod");

  const estatisticSchema = z.object({
    playerId: z.number(),
    teamId: z.number(),
    goals: z.number(),
    assists: z.number(),
    matches: z.number()
  });

  const estatisticResponseSchema = z.object({
    id: z.number(),
    playerId: z.number().nullable(),
    teamId: z.number().nullable(),
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
        data: { playerId, teamId, goals, assists, matches }
      });
      reply.status(201).send(newEstatistic);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Erro ao criar estatística!' });
    }
  });

  // GET - Listar todas as estatísticas
  app.get('/estatistic', {
    schema: {
      querystring: z.object({
        playerId: z.preprocess((val) => val === undefined ? undefined : Number(val), z.number().optional()),
        teamId: z.preprocess((val) => val === undefined ? undefined : Number(val), z.number().optional()),
        goals: z.preprocess((val) => val === undefined ? undefined : Number(val), z.number().optional()),
        assists: z.preprocess((val) => val === undefined ? undefined : Number(val), z.number().optional()),
        matches: z.preprocess((val) => val === undefined ? undefined : Number(val), z.number().optional())
      }).optional(),
      response: {
        200: z.array(estatisticResponseSchema),
        500: z.object({ error: z.string() })
      }
    }
  }, async (request, reply) => {
    const { playerId, teamId, goals, assists, matches } = (request.query ?? {}) as {
      playerId?: number,
      teamId?: number,
      goals?: number,
      assists?: number,
      matches?: number
    };

    try {
      const estatistics = await prisma.estatistic.findMany({
        where: {
          ...(playerId && { playerId: { equals: playerId } }),
          ...(teamId && { teamId: { equals: teamId } }),
          ...(goals && { goals: { equals: goals } }),
          ...(assists && { assists: { equals: assists } }),
          ...(matches && { matches: { equals: matches } })
        }
      });
      reply.send(estatistics);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Erro ao buscar estatísticas.' });
    }
  });

  // GET - Buscar estatística por ID
  app.get('/estatistic/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: {
        200: estatisticResponseSchema,
        404: z.object({ error: z.string() }),
        500: z.object({ error: z.string() })
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    try {
      const estatistica = await prisma.estatistic.findUnique({
        where: { id: Number(id) }
      });

      if (!estatistica) {
        reply.status(404).send({ error: "Estatística não encontrada" });
        return;
      }

      reply.send(estatistica);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao buscar estatística." });
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
        where: { id: Number(id) },
        data: { playerId, teamId, goals, assists, matches }
      });
      reply.status(200).send(updatedEstatistic);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Erro ao atualizar estatística.' });
    }
  });

  // DELETE - Deletar estatística
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
      await prisma.estatistic.delete({ where: { id: Number(id) } });
      reply.send({ message: 'Estatística deletada com sucesso!' });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Erro ao deletar estatística.' });
    }
  });
};
