import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import Cache from 'App/Services/Cache'
import PostHistory from 'App/Models/PostHistory'
import Category from 'App/Models/Category'
import CategoryPost from 'App/Models/CategoryPost'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public currentPostHistoryId: number

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
      sortBy: query.sortBy,
      descending: query.descending,
    }

    const ascDesc = query.descending ? 'desc' : 'asc'
    const ascDescOperator = query.descending ? '<' : '>'

    console.log(ascDesc)

    const boundaries = await this.getBoundary(ascDesc)
    result.totalPage = boundaries.length + 1

    const [{ count }] = await Database.query().from('posts').count('id')
    result.total = parseInt(count)

    const q = Database.query().select('*').from('posts').orderBy('created_at', ascDesc).limit(10)
    if (query.p > 1) {
      const boundary = boundaries[query.p - 2]
      if (boundary) {
        q.where('created_at', ascDescOperator, boundary.created_at)
      }
    }

    result.datum = await q

    return result
  }

  /**
   * 境界値取得
   */
  public static async getBoundary(sortBy: 'asc' | 'desc') {
    const boundary = await Cache.getStore().get(`boundary-${sortBy}`)
    if (boundary) {
      console.log('cache exist')
      console.log(boundary)
      return boundary
    }

    const result = await Database.query()
      .select(
        'x.*',
        Database.raw(`row_number() over (order by created_at ${sortBy}) + 1 page_number`)
      )
      .from(function (db) {
        db.select(
          Database.raw(
            `case mod(row_number() over (order by created_at ${sortBy}), 10) ` +
              'when 0 then 1 ' +
              'else 0 ' +
              'end page_boundary'
          ),
          'posts.*'
        )
          .from('posts')
          .orderBy('created_at', sortBy)
          .as('x')
      })
      .where('x.page_boundary', 1)

    await Cache.getStore().set(`boundary-${sortBy}`, result)

    return result
  }

  /**
   * ポスト作成
   * @param title タイトル
   * @param content 本文
   * @param categories カテゴリ情報
   * @param trx トランザクション
   */
  public static async createPost(
    title: string,
    content: string,
    categories: { name: string }[],
    trx: TransactionClientContract
  ) {
    // 基本データ作成
    const post = new Post()
    post.useTransaction(trx)
    post.title = title
    await post.save()

    const history = new PostHistory()
    history.useTransaction(trx)
    history.postId = post.id
    history.content = content
    await history.save()

    post.currentPostHistoryId = history.id
    await post.save()

    // カテゴリー作成、ポストと関連付け
    for (const { name } of categories) {
      let category = await Category.getByName(name, trx)
      if (!category) {
        category = await Category.createCategory(name, trx)
      }

      await CategoryPost.createCategoryPost(category.id, post.id, trx)
    }

    return post
  }

  /**
   * ポスト取得
   * @param id ポスト.ID
   * @param trx トランザクション。FOR UPDATE NOWAIT で実行。
   */
  public static async getPostById(id: number, trx?: TransactionClientContract) {
    const q = Post.query().where('id', id)
    if (trx) {
      q.useTransaction(trx).forUpdate().noWait()
    }

    return q.first()
  }

  /**
   * ポスト更新
   * @param id
   * @param title
   * @param content
   * @param categories
   * @param trx
   */
  public static async updatePost(
    id: number,
    title: string,
    content: string,
    categories: { name: string }[],
    trx: TransactionClientContract
  ) {
    const history = new PostHistory()
    history.useTransaction(trx)
    history.postId = id
    history.content = content
    await history.save()

    await Post.query().where('id', id).update({
      title: title,
      currentPostHistoryId: history.id,
    })

    await CategoryPost.query().useTransaction(trx).where('post_id', id).delete()

    for (const { name } of categories) {
      let category = await Category.getByName(name, trx)
      if (!category) {
        category = await Category.createCategory(name, trx)
      }

      await CategoryPost.createCategoryPost(category.id, id, trx)
    }
  }

  /**
   * ポスト削除
   * @param id
   * @param trx
   */
  public static async destroyPost(id: number, trx: TransactionClientContract) {
    await CategoryPost.query().useTransaction(trx).where('post_id', id).delete()
    await PostHistory.query().useTransaction(trx).where('post_id', id).delete()
    await Post.query().useTransaction(trx).where('id', id).delete()
  }
}
