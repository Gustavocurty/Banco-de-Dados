import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const teamController: FastifyPluginAsyncZod = async app => {
  const { z } = await import("zod");

  const teamSchema = z.object({
    name: z.string(),
    country: z.string(),
    foundation: z.string().datetime()
  });

  const teamResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    country: z.string(),
    foundation: z.string()
  });

  // POST - Criar time
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
      querystring: z.object({
        q: z.string().optional()
      }),
      response: {
        200: z.array(teamResponseSchema),
        500: z.object({ error: z.string() })
      }
    }
  }, async (request, reply) => {
    const { q } = request.query;
    console.log('Query time:', q);

    try {
      const teams = await prisma.team.findMany({
        where: q ? {
          name: {
            contains: q,
          }
        } 
        : undefined,
        orderBy: {
          name: 'asc'
        }
      });
      reply.send(teams);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Erro ao buscar times.' });
    }
  });

  // GET - Buscar time por ID
  app.get('/team/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: {
        200: teamResponseSchema,
        404: z.object({ error: z.string() }),
        500: z.object({ error: z.string() })
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    try {
      const team = await prisma.team.findUnique({
        where: { id: Number(id) }
      });
      if (!team) {
        reply.status(404).send({ error: 'Time não encontrado.' });
        return;
      }
      reply.send(team);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Erro ao buscar time.' });
    }
  });

  // PUT - Atualizar time
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
        where: { id: Number(id) },
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

  // DELETE - Remover time
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
      await prisma.team.delete({ where: { id: Number(id) } });
      reply.send({ message: 'Time deletado com sucesso!' });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Erro ao deletar time.' });
    }
  });
};
