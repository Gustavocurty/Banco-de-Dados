import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const playerController: FastifyPluginAsyncZod = async (app) => {
  const { z } = await import("zod");

  const positionEnum = z.enum([
    "GOLEIRO",
    "ZAGUEIRO",
    "LATERAL_ESQUERDO",
    "LATERAL_DIREITO",
    "MEIO_CAMPO",
    "ATACANTE",
  ]);

  const nacionalidadeSchema = z.object({
    id: z.number(),
    nome: z.string(),
  });

  const playerSchema = z.object({
    name: z.string(),
    birthday: z.string(),
    nacionalidadeId: z.number(),
    position: positionEnum,
  });

  const playerResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    birthday: z.string(),
    nacionalidadeId: z.number(),
    position: positionEnum,
    positionFormatted: z.string(),
    nacionalidade: nacionalidadeSchema.optional(),
  });

  const errorSchema = z.object({ error: z.string() });
  const idParamSchema = z.object({ id: z.string().regex(/^\d+$/).transform(Number) });

  // Função para formatar a posição, para tornar visualmente melhor
  function formatPosition(pos: string): string {
    return pos
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // CREATE
  app.post("/player", {
    schema: {
      body: playerSchema,
      response: {
        201: playerResponseSchema,
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { name, birthday, nacionalidadeId, position } = request.body;
    try {
      const newPlayer = await prisma.player.create({
        data: { name, birthday, nacionalidadeId, position },
      });
      
      const response = {
        ...newPlayer,
        positionFormatted: formatPosition(newPlayer.position),
      };
      reply.status(201).send(response);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao criar jogador!" });
    }
  });

  // SELECT * FROM player
  app.get("/player", {
    schema: {
      querystring: z.object({
        q: z.string().optional(),
        nacionalidadeId: z.preprocess((v) => v === undefined ? undefined : Number(v), z.number().optional()),
        birthday: z.string().optional(),
        position: positionEnum.optional(),
      }),
      response: {
        200: z.array(playerResponseSchema),
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { q, nacionalidadeId, birthday, position } = request.query;

    try {
      const players = await prisma.player.findMany({
        where: {
          ...(q && { name: { contains: q } }),
          ...(nacionalidadeId && { nacionalidadeId }),
          ...(birthday && { birthday: { contains: birthday } }),
          ...(position && { position }),
        },
        include: {
          nacionalidade: true,
        },
        orderBy: { name: "asc" },
      });

      const playersFormatted = players.map(p => ({
        ...p,
        positionFormatted: formatPosition(p.position),
      }));

      reply.send(playersFormatted);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao buscar jogadores." });
    }
  });

  // SELECT * FROM player WHERE id = ?
  app.get("/player/:id", {
    schema: {
      params: idParamSchema,
      response: {
        200: playerResponseSchema,
        404: errorSchema,
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    try {
      const player = await prisma.player.findUnique({
        where: { id },
        include: { nacionalidade: true },
      });

      if (!player) return reply.status(404).send({ error: "Jogador não encontrado." });

      const playerFormatted = {
        ...player,
        positionFormatted: formatPosition(player.position),
      };

      reply.send(playerFormatted);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao buscar jogador." });
    }
  });

  // UPDATE - where id
  app.put("/player/:id", {
    schema: {
      params: idParamSchema,
      body: playerSchema,
      response: {
        200: playerResponseSchema,
        404: errorSchema,
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const { name, birthday, nacionalidadeId, position } = request.body;
    try {
      const existente = await prisma.player.findUnique({ where: { id } });
      if (!existente) return reply.status(404).send({ error: "Jogador não encontrado." });

      await prisma.player.update({
        where: { id },
        data: { name, birthday, nacionalidadeId, position },
      });

      const withNacionalidade = await prisma.player.findUnique({
        where: { id },
        include: { nacionalidade: true },
      });

      const response = {
        ...withNacionalidade!,
        positionFormatted: formatPosition(withNacionalidade!.position),
      };

      reply.status(200).send(response);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao atualizar jogador." });
    }
  });

  // DELETE
  app.delete("/player/:id", {
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
      const existente = await prisma.player.findUnique({ where: { id } });
      if (!existente) return reply.status(404).send({ error: "Jogador não encontrado." });

      await prisma.player.delete({ where: { id } });
      reply.send({ message: "Jogador deletado com sucesso!" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao deletar jogador." });
    }
  });
};
