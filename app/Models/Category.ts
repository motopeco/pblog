import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static async isExistName(name: string) {
    const categories = await Category.query().where('name', name)

    return categories.length > 0
  }

  public static async createCategory(name: string) {
    const category = new Category()
    category.name = name
    await category.save()
  }
}
