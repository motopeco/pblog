import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/LoginValidator'
import Logger from '@ioc:Adonis/Core/Logger'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

/**
 * 認証系コントローラ
 */
export default class AuthController {
  /**
   * ログイン処理
   * @param ctx
   */
  public async login(ctx: HttpContextContract) {
    try {
      const validator = new LoginValidator(ctx)
      const payload = await ctx.request.validate(validator)

      const user = await User.getUserIdForLogin(payload.email)
      if (!user) {
        Logger.error('user not found.')
        return ctx.response.badRequest('login failed.')
      }

      const isSame = await Hash.verify(user.password, payload.password)
      if (!isSame) {
        Logger.error('invalid password.')
        return ctx.response.badRequest('login failed.')
      }

      await ctx.auth.loginViaId(user.id)
      return ctx.response.send('ok')
    } catch (e) {
      Logger.error(e.messages)
      return ctx.response.badRequest('login failed.')
    }
  }
}
