import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import { uid } from 'uid'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Hash from '@ioc:Adonis/Core/Hash'

export default class SampleUserSeeder extends BaseSeeder {
  public async run() {
    const user = new User()
    user.uid = uid()
    user.email = Encryption.encrypt('sample@example.com')
    user.password = await Hash.make('password')
    await user.save()
  }
}
