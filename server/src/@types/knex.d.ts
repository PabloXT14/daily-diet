// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'
import { UserTableType } from './user-table-type'
import { MealTableType } from './meal-table-type'

declare module 'knex/types/tables' {
  export interface Tables {
    user: UserTableType
    meal: MealTableType
  }
}
