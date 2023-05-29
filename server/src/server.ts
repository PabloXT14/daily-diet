import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/users', async () => {
  try {
    const users = await knex('user').select('*')
    return { users }
  } catch (error) {
    console.log(error)
    return { error }
  }
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('Server is running'))
