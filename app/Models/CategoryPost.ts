import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

export default class CategoryPost extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public categoryId: number

  @column()
  public postId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * データ作成
   * @param categoryId
   * @param postId
   * @param trx
   */
  public static async createCategoryPost(
    categoryId: number,
    postId: number,
    trx: TransactionClientContract
  ) {
    const cp = new CategoryPost()
    cp.useTransaction(trx)
    cp.categoryId = categoryId
    cp.postId = postId
    await cp.save()
  }
}
