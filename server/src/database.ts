import { knex as setupKnex } from 'knex'

export const knex = setupKnex({
  client: "pg",
  connection: 'postgresql://postgres:root@localhost:5433/test',
  searchPath: ['knex', 'public'],
  useNullAsDefault: true,
})