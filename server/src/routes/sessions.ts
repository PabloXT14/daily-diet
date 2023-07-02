import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'

import { knex } from '../database'
import { AppError } from '../utils/AppError'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function sessionsRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await knex('user').first().where({ email })

    if (!user) {
      throw new AppError('Incorrect email or password', 401)
    }

    const hashedPassword = user.password
    const passwordMatched = await bcrypt.compare(password, hashedPassword)

    if (!passwordMatched) {
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

    reply.setCookie('sessionId', sessionId, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day
    })

    return reply.status(201).send({ session_id: sessionId })
  })

  app.post(
    '/logout',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      return reply
        .clearCookie('sessionId', {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        })
        .status(204)
        .send()
    },
  )
}
