import { Knex, knex as setupKnex } from 'knex'

export const config: Knex.Config = {
  client: "pg",
  connection: 'postgresql://postgres:root@localhost:5433/daily-diet-db',
  searchPath: ['knex', 'public'],
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
  useNullAsDefault: true,
}

export const knex = setupKnex(config)