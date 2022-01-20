import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ConsoleController {
  public async index(ctx: HttpContextContract): Promise<any> {
    return ctx.view.render('console')
  }
}
