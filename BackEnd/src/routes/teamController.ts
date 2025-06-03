import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const teamController: FastifyPluginAsyncZod = async app => {
  const { z } = await import("zod");

  const teamSchema = z.object({
    name: z.string(),
    country: z.string(),
    foundation: z.string()
  });

  const teamResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    country: z.string(),
    foundation: z.string()
  });

  // POST - Criar um time
  app.post('/team', {
    schema: {
      body: teamSchema,
      response: {
        201: teamResponseSchema,
        500: z.object({ error: z.string() })
      }
    }
  }, async (request, reply) => {
    const { name, country, foundation } = request.body;

    try {
      const newTeam = await prisma.team.create({
        data: {
          name,
          country,
          foundation
        }
      });
      reply.status(201).send(newTeam);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Erro ao criar time!' });
    }
  });

  // GET - Listar todos os times
  app.get('/team', {
    schema: {
      response: {
        200: z.array(teamResponseSchema),
        500: z.object({ error: z.string() })
      }
    }
  }, async (_, reply) => {
    try {
      const teams = await prisma.team.findMany();
      reply.send(teams);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Erro ao buscar times.' });
    }
  });

  // PUT - Atualizar um time
  app.put('/team/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      body: teamSchema,
      response: {
        200: teamResponseSchema,
        500: z.object({ error: z.string() })
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const { name, country, foundation } = request.body;

    try {
      const updatedTeam = await prisma.team.update({
        where: { id },
        data: {
          name,
          country,
          foundation
        }
      });
      reply.status(200).send(updatedTeam);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Erro ao atualizar time.' });
    }
  });

  // DELETE - Remover um time
  app.delete('/team/:id', {
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
      await prisma.team.delete({ where: { id } });
      reply.send({ message: 'Time deletado com sucesso!' });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Erro ao deletar time.' });
    }
  });
};
