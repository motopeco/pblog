import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
  /**
   * ブログページの表示
   * @param ctx
   */
  public async index(ctx: HttpContextContract): Promise<string> {
    return await ctx.view.render('home')
  }
}
