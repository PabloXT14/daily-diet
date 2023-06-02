import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'

import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { AppError } from '../utils/AppError'
import { UserSchema } from '../schemas/user-schema'

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
    const bodySchema = UserSchema.pick({
      name: true,
      email: true,
      password: true,
      avatar_url: true,
    })

    const { name, email, password, avatar_url } = bodySchema.parse(request.body)

    const userAlreadyExists = await knex('user').first().where({ email })

    if (userAlreadyExists) {
      throw new AppError('User email already exists', 400)
    }

    const sessionId = randomUUID()

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    await knex('user').insert({
      id: randomUUID(),
      name,
      email,
      password,
      avatar_url,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  app.put(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const bodySchema = UserSchema.pick({
        name: true,
        email: true,
        password: true,
        avatar_url: true,
      })

      const { name, email, password, avatar_url } = bodySchema.parse(
        request.body,
      )

      await knex('user')
        .update({
          name,
          email,
          password,
          avatar_url,
          updated_at: knex.fn.now(),
        })
        .where({ session_id: sessionId })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      await knex('user').delete().where({ session_id: sessionId })

      reply.clearCookie('sessionId')

      return reply.status(204).send()
    },
  )
}
