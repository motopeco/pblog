import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CategoryPosts extends BaseSchema {
  protected tableName = 'category_posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table
        .bigInteger('category_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('categories')
        .notNullable()
      table.bigInteger('post_id').unsigned().index().references('id').inTable('posts').notNullable()

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
