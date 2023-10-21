import 'fastify'

declare module 'fastify' {
  // eslint-disable-next-line no-unused-vars
  interface FastifyRequest {
    user: {
      id: string
    }
  }
}
