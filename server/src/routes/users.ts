import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await knex('user').first().where({ session_id: sessionId })

      return reply.status(200).send({ user })
    },
  )

  app.post('/', async (request, reply) => {
    const bodyParams = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      avatar_url: z.string().url(),
    })

    try {
      const { name, email, password, avatar_url } = bodyParams.parse(
        request.body,
      )

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })
      }

      await knex('user').insert({
        id: randomUUID(),
        name,
        email,
        password,
        avatar_url,
        session_id: sessionId,
      })

      return reply.status(201).send()
    } catch (error) {
      console.log(error)

      if (error instanceof z.ZodError) {
        const { issues } = error

        return reply.status(400).send({ issues })
      }

      return reply.status(500).send({ error })
    }
  })
}
