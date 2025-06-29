import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const nacionalidadeController: FastifyPluginAsyncZod = async (app) => {
  const { z } = await import("zod");

  const nacionalidadeSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
  });

  const nacionalidadeResponseSchema = z.object({
    id: z.number(),
    nome: z.string(),
  });

  // CREATE
  app.post(
    "/nacionalidades",
    {
      schema: {
        body: nacionalidadeSchema,
        response: {
          201: nacionalidadeResponseSchema,
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { nome } = request.body;

      try {
        const novaNacionalidade = await prisma.nacionalidade.create({
          data: { nome },
        });
        reply.status(201).send(novaNacionalidade);
      } catch (error) {
        console.error(error);
        reply.status(500).send({ error: "Erro ao criar nacionalidade!" });
      }
    }
  );

  // SELECT * FROM nacionalidades
  app.get(
    "/nacionalidades",
    {
      schema: {
        response: {
          200: z.array(nacionalidadeResponseSchema),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const nacionalidades = await prisma.nacionalidade.findMany({
          orderBy: { nome: "asc" },
        });
        reply.send(nacionalidades);
      } catch (error) {
        console.error(error);
        reply.status(500).send({ error: "Erro ao buscar nacionalidades." });
      }
    }
  );

  // SELECT * FROM nacionalidades WHERE id = ?
  app.get(
    "/nacionalidades/:id",
    {
      schema: {
        params: z.object({ id: z.string() }),
        response: {
          200: nacionalidadeResponseSchema,
          404: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      try {
        const nacionalidade = await prisma.nacionalidade.findUnique({
          where: { id: Number(id) },
        });
        if (!nacionalidade) {
          reply.status(404).send({ error: "Nacionalidade não encontrada." });
          return;
        }
        reply.send(nacionalidade);
      } catch (error) {
        console.error(error);
        reply.status(500).send({ error: "Erro ao buscar nacionalidade." });
      }
    }
  );

  // UPDATE - where id
  app.put(
    "/nacionalidades/:id",
    {
      schema: {
        params: z.object({ id: z.string() }),
        body: nacionalidadeSchema,
        response: {
          200: nacionalidadeResponseSchema,
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { nome } = request.body;

      try {
        const atualizada = await prisma.nacionalidade.update({
          where: { id: Number(id) },
          data: { nome },
        });
        reply.status(200).send(atualizada);
      } catch (error) {
        console.error(error);
        reply.status(500).send({ error: "Erro ao atualizar nacionalidade." });
      }
    }
  );

  // DELETE
  app.delete(
    "/nacionalidades/:id",
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
        await prisma.nacionalidade.delete({ where: { id: Number(id) } });
        reply.send({ message: "Nacionalidade deletada com sucesso!" });
      } catch (error) {
        console.error(error);
        reply.status(500).send({ error: "Erro ao deletar nacionalidade." });
      }
    }
  );
};
