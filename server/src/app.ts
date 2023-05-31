import fastify from 'fastify'
import formbody from '@fastify/formbody'
import cookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { env } from './env'

import { usersRoutes } from './routes/users'
import { sessionsRoutes } from './routes/sessions'
import { AppError } from './utils/AppError'

const app = fastify()

app.register(cookie)
app.register(formbody)

app.register(usersRoutes, { prefix: '/users' })
app.register(sessionsRoutes, { prefix: '/sessions' })

app.setErrorHandler((error, request, reply) => {
  if (env.NODE_ENV !== 'production') {
    console.log(error)
  } else {
    // TODO: Here we should send the error to an external service (like Sentry, Datadog, ...)
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.issues,
    })
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    })
  }

  return reply.status(500).send({
    message: 'Internal server error',
  })
})

export { app }
