import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

import { knex } from '../database'
import { AppError } from '../utils/AppError'

export async function sessionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await knex('user').first().where({
      email,
      password,
    })

    if (!user) {
      throw new AppError('Incorrect email or password', 401)
    }

    if (user.password !== password) {
      throw new AppError('Incorrect email or password', 401)
    }

    const sessionId = randomUUID()

    await knex('user')
      .update({
        session_id: sessionId,
      })
      .where({
        id: user.id,
      })

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    return reply.status(201).send({ session_id: sessionId })
  })
}
