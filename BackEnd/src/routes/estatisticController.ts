import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const estatisticController: FastifyPluginAsyncZod = async (app) => {
  const { z } = await import("zod");

  const estatisticSchema = z.object({
    playerId: z.number(),
    teamId: z.number(),
    goals: z.number().int().nonnegative(),
    assists: z.number().int().nonnegative(),
    matches: z.number().int().nonnegative(),
  });

  const estatisticResponseSchema = estatisticSchema.extend({
    id: z.number(),
    contractStartDate: z.string().nullable(),
    contractEndDate: z.string().nullable(),
  });

  const errorSchema = z.object({ error: z.string() });

  const idParamSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });

  async function findContract(playerId: number, teamId: number) {
    return prisma.contract.findFirst({
      where: { playerId, teamId },
    });
  }

  // Buscamos times distintos de um jogador a partir de contracts
  // SELECT DISTINCT team.id, team.name
  // FROM contract
  // JOIN team ON contract.teamId = team.id
  // WHERE contract.playerId = ?;
  app.get("/contracts/player/:playerId", {
    schema: {
      params: z.object({ playerId: z.string().regex(/^\d+$/).transform(Number) }),
      response: {
        200: z.array(z.object({ id: z.number(), name: z.string() })),
        404: errorSchema,
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { playerId } = request.params;
    try {
      const contracts = await prisma.contract.findMany({
        where: { playerId },
        include: { team: true },
        distinct: ["teamId"],
      });

      const teams = contracts.map((c) => ({ id: c.team.id, name: c.team.name }));
      reply.send(teams);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao buscar times do jogador." });
    }
  });

  // CREATE
  app.post("/estatistic", {
    schema: {
      body: estatisticSchema,
      response: {
        201: estatisticResponseSchema,
        400: errorSchema,
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { playerId, teamId, goals, assists, matches } = request.body;

    try {
      const contract = await findContract(playerId, teamId);
      if (!contract) {
        return reply.status(400).send({ error: "Não existe contrato entre esse jogador e time." });
      }

      const created = await prisma.estatistic.create({
        data: {
          playerId,
          teamId,
          goals,
          assists,
          matches,
          contractStartDate: contract.startDate,
          contractEndDate: contract.endDate,
        },
      });

      const { id, contractStartDate, contractEndDate } = created;
      reply.status(201).send({ playerId, teamId, goals, assists, matches, id, contractStartDate, contractEndDate });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao criar estatística." });
    }
  });

  // SELECT * FROM estatistic
  app.get("/estatistic", {
    schema: {
      querystring: z.object({
        playerId: z.preprocess((v) => v === undefined ? undefined : Number(v), z.number().optional()),
        teamId: z.preprocess((v) => v === undefined ? undefined : Number(v), z.number().optional()),
      }),
      response: {
        200: z.array(estatisticResponseSchema),
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { playerId, teamId } = request.query;
    try {
      const stats = await prisma.estatistic.findMany({
        where: {
          ...(playerId && { playerId }),
          ...(teamId && { teamId }),
        },
        orderBy: { id: "asc" },
      });

      const response = stats.map(({ id, playerId, teamId, goals, assists, matches, contractStartDate, contractEndDate }) => ({
        id, playerId, teamId, goals, assists, matches, contractStartDate, contractEndDate
      }));

      reply.send(response);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao buscar estatísticas." });
    }
  });

  // SELECT * FROM estatistic WHERE id = ?
  app.get("/estatistic/:id", {
    schema: {
      params: idParamSchema,
      response: {
        200: estatisticResponseSchema,
        404: errorSchema,
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;

    try {
      const stat = await prisma.estatistic.findUnique({ where: { id } });
      if (!stat) {
        return reply.status(404).send({ error: "Estatística não encontrada." });
      }

      const { playerId, teamId, goals, assists, matches, contractStartDate, contractEndDate } = stat;
      reply.send({ id, playerId, teamId, goals, assists, matches, contractStartDate, contractEndDate });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao buscar estatística." });
    }
  });

  // UPDATE - where id
  app.put("/estatistic/:id", {
    schema: {
      params: idParamSchema,
      body: estatisticSchema,
      response: {
        200: estatisticResponseSchema,
        400: errorSchema,
        404: errorSchema,
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const { playerId, teamId, goals, assists, matches } = request.body;

    try {
      const existing = await prisma.estatistic.findUnique({ where: { id } });
      if (!existing) {
        return reply.status(404).send({ error: "Estatística não encontrada." });
      }

      const contract = await findContract(playerId, teamId);
      if (!contract) {
        return reply.status(400).send({ error: "Não existe contrato entre esse jogador e time." });
      }

      const updated = await prisma.estatistic.update({
        where: { id },
        data: {
          playerId,
          teamId,
          goals,
          assists,
          matches,
          contractStartDate: contract.startDate,
          contractEndDate: contract.endDate,
        },
      });

      const { contractStartDate, contractEndDate } = updated;
      reply.send({ id, playerId, teamId, goals, assists, matches, contractStartDate, contractEndDate });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao atualizar estatística." });
    }
  });

  // DELETE
  app.delete("/estatistic/:id", {
    schema: {
      params: idParamSchema,
      response: {
        200: z.object({ message: z.string() }),
        404: errorSchema,
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;

    try {
      const existente = await prisma.estatistic.findUnique({ where: { id } });
      if (!existente) {
        return reply.status(404).send({ error: "Estatística não encontrada." });
      }

      await prisma.estatistic.delete({ where: { id } });
      reply.send({ message: "Estatística deletada com sucesso!" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao deletar estatística." });
    }
  });
};
