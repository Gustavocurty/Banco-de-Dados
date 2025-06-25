import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const contractController: FastifyPluginAsyncZod = async (app) => {
  const { z } = await import("zod");

  const contractSchema = z.object({
    playerId: z.number(),
    teamId: z.number(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  });

  const contractResponseSchema = z.object({
    id: z.number(),
    playerId: z.number(),
    teamId: z.number(),
    startDate: z.string(),
    endDate: z.string(),
  });

  // POST - Criar contrato
  app.post(
    "/contract",
    {
      schema: {
        body: contractSchema,
        response: {
          201: contractResponseSchema,
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { playerId, teamId, startDate, endDate } = request.body;

      try {
        const newContract = await prisma.contract.create({
          data: {
            playerId,
            teamId,
            startDate,
            endDate,
          },
        });

        reply.status(201).send({
          ...newContract,
          startDate: new Date(newContract.startDate).toISOString(),
          endDate: new Date(newContract.endDate).toISOString(),
        });
      } catch (error) {
        console.error("Erro ao criar contrato:", error);
        reply.status(500).send({ error: "Erro ao criar contrato!" });
      }
    }
  );

  // GET - Listar contratos
  app.get(
    "/contract",
    {
      schema: {
        querystring: z.object({
          q: z.string().optional(),
        }),
        response: {
          200: z.array(contractResponseSchema),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { q } = request.query;
      console.log("Query contratos:", q);
      try {
        const contracts = await prisma.contract.findMany();
        
      // try {
      //     const contracts = await prisma.contract.findMany({
      //       where: q ? {
      //         name: {
      //           contains: q,
      //         }
      //       }
      //         : undefined,
      //       orderBy: {
      //         name: 'asc' // ordena por nome
      //       }
      //     });

        reply.send(
          contracts.map((contract) => ({
            ...contract,
            startDate: new Date(contract.startDate).toISOString(),
            endDate: new Date(contract.endDate).toISOString(),
          }))
        );
      } catch (error) {
        console.error("Erro ao buscar contratos:", error);
        reply.status(500).send({ error: "Erro ao buscar contratos." });
      }
    }
  );

  // GET - Buscar contrato por ID
  app.get(
    "/contract/:id",
    {
      schema: {
        params: z.object({ id: z.string() }),
        response: {
          200: contractResponseSchema,
          404: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      try {
        const contract = await prisma.contract.findUnique({
          where: { id: Number(id) },
        });

        if (!contract) {
          return reply.status(404).send({ error: "Contrato não encontrado" });
        }

        reply.send({
          ...contract,
          startDate: new Date(contract.startDate).toISOString(),
          endDate: new Date(contract.endDate).toISOString(),
        });
      } catch (error) {
        console.error("Erro ao buscar contrato:", error);
        reply.status(500).send({ error: "Erro ao buscar contrato." });
      }
    }
  );

  // PUT - Atualizar contrato
  app.put(
    "/contract/:id",
    {
      schema: {
        params: z.object({ id: z.string() }),
        body: contractSchema,
        response: {
          200: contractResponseSchema,
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { playerId, teamId, startDate, endDate } = request.body;

      try {
        const updatedContract = await prisma.contract.update({
          where: { id: Number(id) },
          data: {
            playerId,
            teamId,
            startDate,
            endDate,
          },
        });

        reply.status(200).send({
          ...updatedContract,
          startDate: new Date(updatedContract.startDate).toISOString(),
          endDate: new Date(updatedContract.endDate).toISOString(),
        });
      } catch (error) {
        console.error("Erro ao atualizar contrato:", error);
        reply.status(500).send({ error: "Erro ao atualizar contrato." });
      }
    }
  );

  // DELETE - Remover contrato
  app.delete(
    "/contract/:id",
    {
      schema: {
        params: z.object({ id: z.string() }),
        response: {
          200: z.object({ message: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      try {
        await prisma.contract.delete({ where: { id: Number(id) } });
        reply.send({ message: "Contrato deletado com sucesso!" });
      } catch (error) {
        console.error("Erro ao deletar contrato:", error);
        reply.status(500).send({ error: "Erro ao deletar contrato." });
      }
    }
  );
};
