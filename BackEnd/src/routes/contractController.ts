import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const contractController: FastifyPluginAsyncZod = async app => {
    const { z } = await import("zod");

    const contractSchema = z.object({
        playerId: z.string(),
        teamId: z.string(),
        startDate: z.string().datetime(),
        endDate: z.string().datetime()
    });

    const contractResponseSchema = z.object({
        id: z.string(),
        playerId: z.string(),
        teamId: z.string(),
        startDate: z.string(),
        endDate: z.string()
    });

    // POST - Criar contrato
    app.post('/contract', {
        schema: {
            body: contractSchema,
            response: {
                201: contractResponseSchema,
                500: z.object({ error: z.string() })
            }
        }
    }, async (request, reply) => {
        const { playerId, teamId, startDate, endDate } = request.body;

        try {
            const newContract = await prisma.contract.create({
                data: {
                    playerId,
                    teamId,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate)
                }
            });
            reply.status(201).send({
                ...newContract,
                startDate: newContract.startDate.toISOString(),
                endDate: newContract.endDate.toISOString()
            });
        } catch (error) {
            console.log(error)
            reply.status(500).send({ error: 'Erro ao criar contrato!' });
        }
    });

    // GET - Listar contratos
    app.get('/contract', {
        schema: {
            response: {
                200: z.array(contractResponseSchema),
                500: z.object({ error: z.string() })
            }
        }
    }, async (_, reply) => {
        try {
            const contracts = await prisma.contract.findMany();
            reply.send(contracts.map(contract => ({
                ...contract,
                startDate: contract.startDate.toISOString(),
                endDate: contract.endDate.toISOString()
            })));
        } catch (error) {
            reply.status(500).send({ error: 'Erro ao buscar contratos.' });
        }
    });

    // PUT - Atualizar contrato
    app.put('/contract/:id', {
        schema: {
            params: z.object({ id: z.string() }),
            body: contractSchema,
            response: {
                200: contractResponseSchema,
                500: z.object({ error: z.string() })
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        const { playerId, teamId, startDate, endDate } = request.body;

        try {
            const updatedContract = await prisma.contract.update({
                where: { id },
                data: {
                    playerId,
                    teamId,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate)
                }
            });
            reply.status(200).send({
                ...updatedContract,
                startDate: updatedContract.startDate.toISOString(),
                endDate: updatedContract.endDate.toISOString()
            });
        } catch (error) {
            reply.status(500).send({ error: 'Erro ao atualizar contrato.' });
        }
    });

    // DELETE - Remover contrato
    app.delete('/contract/:id', {
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
            await prisma.contract.delete({ where: { id } });
            reply.send({ message: 'Contrato deletado com sucesso!' });
        } catch (error) {
            reply.status(500).send({ error: 'Erro ao deletar contrato.' });
        }
    });
};
