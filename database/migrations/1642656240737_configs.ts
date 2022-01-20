import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Configs extends BaseSchema {
  protected tableName = 'configs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.text('key').notNullable().unique()
      table.text('value').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
