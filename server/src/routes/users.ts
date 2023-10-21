import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'

import { knex } from '../database'
import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { AppError } from '../utils/app-error'
import { UserSchema } from '../schemas/user-schema'

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [ensureAuthenticated] },
    async (request, reply) => {
      const { id: user_id } = request.user

      const user = await knex('users').first().where({ id: user_id })

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

    const userAlreadyExists = await knex('users').first().where({ email })

    if (userAlreadyExists) {
      throw new AppError('User email already exists', 400)
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
      avatar_url,
    })

    return reply.status(201).send()
  })

  app.put(
    '/',
    { preHandler: [ensureAuthenticated] },
    async (request, reply) => {
      const { id: user_id } = request.user

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

      let hashedPassword = ''
      let user = null
      if (password) {
        const saltRounds = 10
        hashedPassword = await bcrypt.hash(password, saltRounds)
        user = await knex('users').first().where({ id: user_id })
      }

      await knex('users')
        .update({
          name,
          email,
          password: password ? hashedPassword : user?.password,
          avatar_url,
          updated_at: knex.fn.now(),
        })
        .where({ id: user_id })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/',
    { preHandler: [ensureAuthenticated] },
    async (request, reply) => {
      const { id: user_id } = request.user

      await knex('users').delete().where({ id: user_id })

      reply.clearCookie('token')

      return reply.status(204).send()
    },
  )
}
