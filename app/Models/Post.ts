import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
import Cache from 'App/Services/Cache'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static async getPaginate(query: BlogPagePaginateQuery): Promise<PaginateResult> {
    const result: PaginateResult = {
      total: 0,
      datum: [],
      page: query.p,
      totalPage: 0,
    }

    const boundaries = await this.getBoundary()
    result.totalPage = boundaries.length + 1

    const [{ count }] = await Database.query().from('posts').count('id')
    result.total = parseInt(count)

    const q = Database.query().select('*').from('posts').orderBy('created_at').limit(10)
    if (query.p > 1) {
      const boundary = boundaries[query.p - 2]
      if (boundary) {
        q.where('created_at', '>', boundary.created_at)
      }
    }

    result.datum = await q

    return result
  }

  /**
   * 境界値取得
   */
  public static async getBoundary() {
    const boundary = await Cache.getStore().get('boundary')
    if (boundary) {
      console.log('cache exist')
      return boundary
    }

    const result = await Database.query()
      .select('x.*', Database.raw('row_number() over (order by created_at) + 1 page_number'))
      .from(function (db) {
        db.select(
          Database.raw(
            'case mod(row_number() over (order by created_at), 10) ' +
              'when 0 then 1 ' +
              'else 0 ' +
              'end page_boundary'
          ),
          'posts.*'
        )
          .from('posts')
          .orderBy('created_at')
          .as('x')
      })
      .where('x.page_boundary', 1)

    await Cache.getStore().set('boundary', result)

    return result
  }
}
