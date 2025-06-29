import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const contractController: FastifyPluginAsyncZod = async (app) => {
  const { z } = await import("zod");

  const baseContractSchema = z.object({
    playerId: z.number(),
    teamId: z.number(),
    startDate: z.string(),
    endDate: z.string(),
  });

  const contractSchema = baseContractSchema.refine(
    (data) => data.startDate < data.endDate,
    {
      message: "Data de início deve ser anterior à data de término.",
      path: ["endDate"],
    }
  );

  const contractResponseSchema = baseContractSchema.extend({
    id: z.number(),
  });

  const idParamSchema = z.object({ id: z.string().regex(/^\d+$/) });

  // Função para calcular idade do jogador na data de início do contrato, visto que menores de 16 não podem ter contrato profissional
  function calcularIdade(dataNascimento: string, dataReferencia: string): number {
    const nascimento = new Date(dataNascimento);
    const referencia = new Date(dataReferencia);

    let idade = referencia.getFullYear() - nascimento.getFullYear();
    const m = referencia.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && referencia.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  async function hasDateConflict(
    playerId: number,
    startDate: string,
    endDate: string,
    ignoreContractId?: number
  ) {
    const conflict = await prisma.contract.findFirst({
      where: {
        playerId,
        id: ignoreContractId ? { not: ignoreContractId } : undefined,
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
    });
    return !!conflict;
  }

  // CREATE
  app.post(
    "/contract",
    {
      schema: {
        body: contractSchema,
        response: {
          201: contractResponseSchema,
          400: z.object({ error: z.string() }),
          422: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { playerId, teamId, startDate, endDate } = request.body;

      try {
        // Faz a busca pelo jogador para validar idade
        const player = await prisma.player.findUnique({ where: { id: playerId } });
        if (!player) {
          return reply.status(400).send({ error: "Jogador não encontrado." });
        }

        // Vê qual a idade do jogador na data de início do contrato
        const idade = calcularIdade(player.birthday, startDate);
        if (idade < 16) {
          return reply.status(400).send({ error: "Não é permitido contrato com jogadores menores de 16 anos." });
        }

        const conflict = await hasDateConflict(playerId, startDate, endDate);
        if (conflict) {
          return reply.status(400).send({
            error: "Já existe um contrato com essas datas para esse jogador.",
          });
        }

        const newContract = await prisma.contract.create({
          data: { playerId, teamId, startDate, endDate },
        });

        reply.status(201).send(newContract);
      } catch (error) {
        console.error("Erro no POST /contract:", error);
        reply.status(500).send({ error: "Erro ao criar contrato." });
      }
    }
  );

  // SELECT * FROM contract
  app.get(
    "/contract",
    {
      schema: {
        querystring: z.object({
          playerId: z
            .preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().optional()),
          teamId: z
            .preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().optional()),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }),
        response: {
          200: z.array(contractResponseSchema),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { playerId, teamId, startDate, endDate } = request.query;

      try {
        const contracts = await prisma.contract.findMany({
          where: {
            ...(playerId && { playerId }),
            ...(teamId && { teamId }),
            ...(startDate && { startDate: { gte: startDate } }),
            ...(endDate && { endDate: { lte: endDate } }),
          },
          orderBy: { startDate: "desc" },
        });

        reply.send(contracts);
      } catch (error) {
        console.error("Erro no GET /contract:", error);
        reply.status(500).send({ error: "Erro ao buscar contratos." });
      }
    }
  );

  // SELECT * FROM contract WHERE id = ?
  app.get(
    "/contract/:id",
    {
      schema: {
        params: idParamSchema,
        response: {
          200: contractResponseSchema,
          404: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const contractId = Number(request.params.id);

      try {
        const contract = await prisma.contract.findUnique({
          where: { id: contractId },
        });

        if (!contract) {
          return reply.status(404).send({ error: "Contrato não encontrado." });
        }

        reply.send(contract);
      } catch (error) {
        console.error("Erro no GET /contract/:id:", error);
        reply.status(500).send({ error: "Erro ao buscar contrato." });
      }
    }
  );

  // UPDATE - where id
  app.put(
    "/contract/:id",
    {
      schema: {
        params: idParamSchema,
        body: contractSchema,
        response: {
          200: contractResponseSchema,
          400: z.object({ error: z.string() }),
          422: z.object({ error: z.string() }),
          404: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const contractId = Number(request.params.id);
      const { playerId, teamId, startDate, endDate } = request.body;

      try {
        const existing = await prisma.contract.findUnique({
          where: { id: contractId },
        });

        if (!existing) {
          return reply.status(404).send({ error: "Contrato não encontrado." });
        }

        // Novamente, faz a busca do jogador para validar idade
        const player = await prisma.player.findUnique({ where: { id: playerId } });
        if (!player) {
          return reply.status(400).send({ error: "Jogador não encontrado." });
        }

        // E calcula sua idade na data de início do contrato
        const idade = calcularIdade(player.birthday, startDate);
        if (idade < 16) {
          return reply.status(400).send({ error: "Não é permitido contrato com jogadores menores de 16 anos." });
        }

        const conflict = await hasDateConflict(playerId, startDate, endDate, contractId);

        if (conflict) {
          return reply.status(400).send({
            error: "Já existe um contrato com essas datas para esse jogador.",
          });
        }

        const updated = await prisma.contract.update({
          where: { id: contractId },
          data: { playerId, teamId, startDate, endDate },
        });

        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro no PUT /contract/:id:", error);
        reply.status(500).send({
          error: `Erro ao atualizar contrato: ${
            error instanceof Error ? error.message : String(error)
          }`,
        });
      }
    }
  );

  // DELETE
  app.delete(
    "/contract/:id",
    {
      schema: {
        params: idParamSchema,
        response: {
          200: z.object({ message: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const contractId = Number(request.params.id);

      try {
        await prisma.contract.delete({ where: { id: contractId } });
        reply.send({ message: "Contrato deletado com sucesso!" });
      } catch (error) {
        console.error("Erro no DELETE /contract/:id:", error);
        reply.status(500).send({ error: "Erro ao deletar contrato." });
      }
    }
  );

  // ROTA para buscar contratos de um jogador, incluindo dados do time
  app.get(
    "/contract/player/:id",
    {
      schema: {
        params: z.object({ id: z.string().regex(/^\d+$/) }),
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              playerId: z.number(),
              teamId: z.number(),
              startDate: z.string(),
              endDate: z.string(),
              team: z.object({
                id: z.number(),
                name: z.string(),
              }),
            })
          ),
          404: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const playerId = Number(request.params.id);
      try {
        const contracts = await prisma.contract.findMany({
          where: { playerId },
          include: { team: true },
          orderBy: { startDate: "desc" },
        });

        reply.send(contracts);
      } catch (error) {
        console.error("Erro no GET /contract/player/:id:", error);
        reply.status(500).send({ error: "Erro ao buscar contratos do jogador." });
      }
    }
  );
};
