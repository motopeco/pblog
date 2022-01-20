import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PostHistories extends BaseSchema {
  protected tableName = 'post_histories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('post_id').unsigned().index().references('id').inTable('posts').notNullable()
      table.text('content').notNullable()

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
