import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BlogPageController {
  public async paginate(ctx: HttpContextContract) {
    const qs = ctx.request.qs()
    const query = this.getPaginateOption(qs)
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
