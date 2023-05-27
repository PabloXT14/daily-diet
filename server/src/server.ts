import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/users', async () => {
  try {
    const users = await knex('User').select('*')
    return { users }
  } catch (error) {
    console.log(error)
    return { error }
  }

})

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('Server is running'))
