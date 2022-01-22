import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * 名前を使用しているカテゴリが存在しているか判定
   * @param name 名前
   * @param ignoreId 存在判定の条件から、特定のIDを排除
   * @param trx トランザクション
   */
  public static async isExistName(
    name: string,
    ignoreId?: number,
    trx?: TransactionClientContract
  ) {
    const q = Category.query().where('name', name)
    if (ignoreId) {
      q.whereNot('id', ignoreId)
    }

    if (trx) {
      q.useTransaction(trx)
    }

    const categories = await q

    return categories.length > 0
  }

  /**
   * カテゴリ作成
   * @param name 名前
   */
  public static async createCategory(name: string) {
    const category = new Category()
    category.name = name
    await category.save()
  }

  /**
   * 名前からカテゴリーを取得
   * @param name 名前
   * @param trx トランザクション。FOR UPDATE NOWAIT をつける。
   */
  public static async getByName(name: string, trx?: TransactionClientContract) {
    const q = Category.query().where('name', name)
    if (trx) {
      q.useTransaction(trx).forUpdate().noWait()
    }

    return q.first()
  }
}
