import { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../lib/prisma.js'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })
    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  app.get('/memories/:id', (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)
    const memory = prisma.memory.findUniqueOrThrow({
      where: { id },
    })

    return memory
  })

  app.post('/memories', (request) => {
    const paramsSchema = z.object({
      content: z.string().uuid(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string(),
    })

    const { content, coverUrl, isPublic } = paramsSchema.parse(request.body)
    const memory = prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: 'c84efab5-f573-40ee-afe3-ae3d14fce7ea',
      },
    })

    return memory
  })

  app.put('/memories/:id', (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string().uuid(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string(),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)
    const memory = prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    })

    return memory
  })

  app.delete('/memories/:id', (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)
    prisma.memory.delete({
      where: { id },
    })
  })
}
