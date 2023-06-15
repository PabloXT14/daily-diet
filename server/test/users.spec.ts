import { describe, it, afterAll, beforeAll, beforeEach, expect } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'

import { app } from '../src/app'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  describe('POST /users', () => {
    it('should be able to create a user', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
          avatar_url: 'https://github.com/johndoe.png',
        })
        .expect(201)
    })

    it('should not be able to create a user with an existing email', async () => {
      await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
        avatar_url: 'https://github.com/johndoe.png',
      })

      await request(app.server)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
          avatar_url: 'https://github.com/johndoe.png',
        })
        .expect(400)
    })

    it('should not be able to create a user without all the required fields', async () => {
      await request(app.server).post('/users').send({}).expect(400)
    })

    it('should return sessionId in response cookies', async () => {
      const createUserResponse = await request(app.server)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '123456',
          avatar_url: 'https://github.com/johndoe.png',
        })
        .expect(201)

      const [sessionId] = createUserResponse.get('Set-Cookie')

      expect(sessionId).toBeDefined()
    })
  })
})
