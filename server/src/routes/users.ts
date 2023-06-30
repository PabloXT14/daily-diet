import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'

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

    reply.setCookie('sessionId', sessionId, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day
    })

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    await knex('user').insert({
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
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
        .partial()
        .refine(
          (obj) => {
            const isEmpty = Object.keys(obj).length <= 0
            return !isEmpty
          },
          {
            message: 'The body must not be empty',
          },
        )

      const { name, email, password, avatar_url } = bodySchema.parse(
        request.body,
      )

      const saltRounds = 10
      let hashedPassword = ''
      if (password) {
        hashedPassword = await bcrypt.hash(password, saltRounds)
      }

      const user = await knex('user').first().where({ session_id: sessionId })

      await knex('user')
        .update({
          name,
          email,
          password: password ? hashedPassword : user?.password,
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
