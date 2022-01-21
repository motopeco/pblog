import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PageListValidator from 'App/Validators/PageListValidator'
import Post from 'App/Models/Post'

export default class BlogPageController {
  public async paginate(ctx: HttpContextContract) {
    try {
      const validator = new PageListValidator(ctx)
      const payload = await ctx.request.validate(validator)

      const qs = ctx.request.qs()
      const query = this.getPaginateOption(qs)

      const paginate = await Post.getPaginate(query)
      ctx.response.send(paginate)
    } catch (e) {
      ctx.response.badRequest(e.messages)
    }
  }

  private getPaginateOption(queryString): BlogPagePaginateQuery {
    const qs: BlogPagePaginateQuery = {
      p: 1,
    }

    if (queryString.p && !isNaN(queryString.p)) {
      const p = parseInt(queryString.p)
      qs.p = p > 0 ? p : 1
    }

    return qs
  }
}
