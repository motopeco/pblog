import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PageListValidator from 'App/Validators/PageListValidator'
import Post from 'App/Models/Post'

export default class BlogPageController {
  /**
   * ブログのページネーションデータ取得
   * p: ページ番号
   * @param ctx
   */
  public async paginate(ctx: HttpContextContract) {
    try {
      const validator = new PageListValidator(ctx)
      const payload = await ctx.request.validate(validator)

      const paginate = await Post.getPaginate(payload)
      ctx.response.send(paginate)
    } catch (e) {
      ctx.response.badRequest(e.messages)
    }
  }
}
