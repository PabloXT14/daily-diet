import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'

import { knex } from '../database'
import { AppError } from '../utils/AppError'
import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { jwtConfig } from '../configs/auth'

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

    const { secret, expiresIn } = jwtConfig

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    })

    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day
    })

    const { password: _, ...userWithoutPassword } = user

    return reply.status(201).send({ user: userWithoutPassword })
  })

  app.post(
    '/logout',
    { preHandler: [ensureAuthenticated] },
    async (request, reply) => {
      return reply
        .clearCookie('token', {
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
