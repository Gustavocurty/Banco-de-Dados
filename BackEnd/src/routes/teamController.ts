import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const teamController: FastifyPluginAsyncZod = async (app) => {
  const { z } = await import("zod");

  const nacionalidadeSchema = z.object({
    id: z.number(),
    nome: z.string(),
  });

  const teamSchema = z.object({
    name: z.string(),
    foundation: z.string(),
    nacionalidadeId: z.number(),
  });

  const teamResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    foundation: z.string(),
    nacionalidadeId: z.number(),
    nacionalidade: nacionalidadeSchema,
  });

  const errorSchema = z.object({ error: z.string() });

  const idParamSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });

  const querySchema = z.object({
    q: z.string().optional(),
    foundation: z.string().optional(),
    nacionalidade: z.string().optional(), // Filtro por nome da nacionalidade
  });

  // CREATE
  app.post("/team", {
    schema: {
      body: teamSchema,
      response: {
        201: teamResponseSchema,
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { name, foundation, nacionalidadeId } = request.body;
    try {
      const newTeam = await prisma.team.create({
        data: { name, foundation, nacionalidadeId },
        include: { nacionalidade: true },
      });
      reply.status(201).send(newTeam);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao criar time!" });
    }
  });

  // READ ALL
  app.get("/team", {
    schema: {
      querystring: querySchema,
      response: {
        200: z.array(teamResponseSchema),
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { q, foundation, nacionalidade } = request.query;
    try {
      const teams = await prisma.team.findMany({
        where: {
          ...(q && { name: { contains: q } }),
          ...(foundation && { foundation: { contains: foundation } }),
          ...(nacionalidade && {
            nacionalidade: {
              nome: { contains: nacionalidade },
            },
          }),
        },
        include: { nacionalidade: true },
        orderBy: { name: "asc" },
      });
      reply.send(teams);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao buscar times." });
    }
  });

  // READ BY ID
  app.get("/team/:id", {
    schema: {
      params: idParamSchema,
      response: {
        200: teamResponseSchema,
        404: errorSchema,
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    try {
      const team = await prisma.team.findUnique({
        where: { id },
        include: { nacionalidade: true },
      });
      if (!team) return reply.status(404).send({ error: "Time não encontrado." });
      reply.send(team);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao buscar time." });
    }
  });

  // UPDATE
  app.put("/team/:id", {
    schema: {
      params: idParamSchema,
      body: teamSchema,
      response: {
        200: teamResponseSchema,
        404: errorSchema,
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const { name, foundation, nacionalidadeId } = request.body;
    try {
      const existente = await prisma.team.findUnique({ where: { id } });
      if (!existente) {
        return reply.status(404).send({ error: "Time não encontrado." });
      }
      const updatedTeam = await prisma.team.update({
        where: { id },
        data: { name, foundation, nacionalidadeId },
        include: { nacionalidade: true },
      });
      reply.status(200).send(updatedTeam);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao atualizar time." });
    }
  });

  // DELETE
  app.delete("/team/:id", {
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
      const existente = await prisma.team.findUnique({ where: { id } });
      if (!existente) {
        return reply.status(404).send({ error: "Time não encontrado." });
      }
      await prisma.team.delete({ where: { id } });
      reply.send({ message: "Time deletado com sucesso!" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao deletar time." });
    }
  });
};
