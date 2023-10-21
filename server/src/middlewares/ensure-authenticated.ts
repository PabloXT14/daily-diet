import { FastifyReply, FastifyRequest } from 'fastify'
import { verify } from 'jsonwebtoken'

import { AppError } from '../utils/app-error'
import { jwtConfig } from '../configs/auth'

export async function ensureAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers

  if (!authHeader.cookie) {
    throw new AppError('JWT token missing', 401)
  }

  const [, token] = authHeader.cookie.split('token=')

  try {
    const { sub: user_id } = verify(token, jwtConfig.secret)

    request.user = {
      id: user_id as string,
    }
  } catch (error) {
    throw new AppError('Invalid JWT token', 401)
  }
}
