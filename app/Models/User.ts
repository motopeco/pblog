import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Encryption from '@ioc:Adonis/Core/Encryption'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  /**
   * メールアドレスは暗号化するため、認証機能用のユニークな値として uid を使用。
   */
  public uid: string

  @column()
  public email: string

  @column()
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static async getUserIdForLogin(email: string) {
    const users = await User.all()

    return users
      .map((user) => {
        // メールアドレスは暗号化されているので、復号化
        user.email = Encryption.decrypt(user.email) || ''
        return user.toJSON()
      })
      .find((user) => {
        return user.email === email
      })
  }
}
