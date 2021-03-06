import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreCategoryValidator from 'App/Validators/StoreCategoryValidator'
import Category from 'App/Models/Category'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import UpdateCategoryValidator from 'App/Validators/UpdateCategoryValidator'
import StorePostValidator from 'App/Validators/StorePostValidator'
import Post from 'App/Models/Post'
import UpdatePostValidator from 'App/Validators/UpdatePostValidator'
import PageListManagerValidator from 'App/Validators/PageListManagerValidator'

/**
 * ブログ管理コンソール用API
 */
export default class BlogManagerController {
  /**
   * ポスト一覧表示用
   */
  public async paginate(ctx: HttpContextContract) {
    try {
      const validator = new PageListManagerValidator(ctx)
      const payload = await ctx.request.validate(validator)

      const paginate = await Post.getPaginate(payload)
      ctx.response.send(paginate)
    } catch (e) {
      Logger.error(e.messages)
      ctx.response.badRequest(e.messages)
    }
  }

  /**
   * カテゴリ一覧表示用
   */
  public async categoryPaginate() {}

  /**
   * ポスト作成
   */
  public async storePost(ctx: HttpContextContract) {
    const trx = await Database.transaction()

    try {
      const validator = new StorePostValidator(ctx)
      const payload = await ctx.request.validate(validator)

      await Post.createPost(payload.title, payload.content, payload.categories, trx)

      await trx.commit()
      return ctx.response.send('ok')
    } catch (e) {
      await trx.rollback()
      Logger.error(e.messages)
      return ctx.response.badRequest()
    }
  }

  /**
   * ポスト情報取得
   */
  public async getPost() {}

  /**
   * ポスト更新
   */
  public async updatePost(ctx: HttpContextContract) {
    const trx = await Database.transaction()
    const postId = ctx.params.postId as number

    try {
      const validator = new UpdatePostValidator(ctx)
      const payload = await ctx.request.validate(validator)

      const post = await Post.getPostById(postId, trx)
      if (!post) {
        await trx.rollback()
        return ctx.response.notFound()
      }

      await Post.updatePost(post.id, payload.title, payload.content, payload.categories, trx)

      await trx.commit()
      return ctx.response.send('ok')
    } catch (e) {
      await trx.rollback()
      Logger.error(e.messages)
      return ctx.response.badRequest()
    }
  }

  /**
   * ポスト削除
   */
  public async destroyPost(ctx: HttpContextContract) {
    const trx = await Database.transaction()
    const postId = ctx.params.postId as number

    try {
      const post = await Post.getPostById(postId, trx)
      if (!post) {
        await trx.rollback()
        return ctx.response.notFound()
      }

      await Post.destroyPost(post.id, trx)

      await trx.commit()
      return ctx.response.send('ok')
    } catch (e) {
      await trx.rollback()
      Logger.error(e.messages)
      return ctx.response.badRequest()
    }
  }

  /**
   * ポスト履歴一覧表示用
   */
  public async postHistoryPaginate() {}

  /**
   * ポスト履歴取得
   */
  public async getPostHistory() {}

  /**
   * ポスト履歴の内容を、現在のポスト情報にコピー
   * 本文の内容を過去の履歴からコピー出来る機能。
   * （所謂ロールバック用）
   */
  public async copyPostHistory() {}

  /**
   * カテゴリー作成
   */
  public async storeCategory(ctx: HttpContextContract) {
    try {
      const validator = new StoreCategoryValidator(ctx)
      const payload = await ctx.request.validate(validator)

      const isExist = await Category.isExistName(payload.name)
      if (isExist) {
        return ctx.response.badRequest()
      }

      await Category.createCategory(payload.name)
      return ctx.response.send('ok')
    } catch (e) {
      Logger.error(e.messages)
      return ctx.response.badRequest()
    }
  }

  /**
   * カテゴリー情報取得
   * カテゴリーに関連付けられたポスト一覧も取得できる。
   */
  public async getCategory() {}

  /**
   * カテゴリー更新
   */
  public async updateCategory(ctx: HttpContextContract) {
    const trx = await Database.transaction()

    try {
      const validator = new UpdateCategoryValidator(ctx)
      const payload = await ctx.request.validate(validator)

      const category = await Category.getByName(payload.name, trx)
      if (!category) {
        await trx.rollback()
        return ctx.response.notFound()
      }

      const isExist = await Category.isExistName(payload.name, category.id, trx)
      if (isExist) {
        await trx.rollback()
        return ctx.response.badRequest()
      }

      category.name = payload.name
      category.useTransaction(trx)
      await category.save()

      await trx.commit()

      return ctx.response.send('ok')
    } catch (e) {
      await trx.rollback()
      Logger.error(e.messages)
      return ctx.response.badRequest()
    }
  }

  /**
   * カテゴリー削除
   * ポストとの関連付けも削除される。
   */
  public async destroyCategory(ctx: HttpContextContract) {
    const trx = await Database.transaction()

    try {
      const validator = new UpdateCategoryValidator(ctx)
      const payload = await ctx.request.validate(validator)

      const category = await Category.getByName(payload.name, trx)
      if (!category) {
        await trx.rollback()
        return ctx.response.notFound()
      }

      await Category.destroyCategory(category.id, trx)

      await trx.commit()

      return ctx.response.send('ok')
    } catch (e) {
      await trx.rollback()
      Logger.error(e.messages)
      return ctx.response.badRequest()
    }
  }
}
