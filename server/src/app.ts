import fastify from 'fastify'
import formbody from '@fastify/formbody'
import cookie from '@fastify/cookie'

import { usersRoutes } from './routes/users'

const app = fastify()

app.register(cookie)
app.register(formbody)

app.register(usersRoutes, { prefix: '/users' })

export { app }
