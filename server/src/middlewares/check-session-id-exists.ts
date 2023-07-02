import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '../database'
import { AppError } from '../utils/AppError'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = request.cookies

  if (!sessionId) {
    throw new AppError('Unauthorized', 401)
  }

  const user = await knex('user').where({ session_id: sessionId }).first()

  if (!user) {
    throw new AppError('Unauthorized', 401)
  }
}
