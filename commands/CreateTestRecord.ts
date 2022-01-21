import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class CreateTestRecord extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'create:test_record'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'create test data (database records).'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    const { default: Database } = await import('@ioc:Adonis/Lucid/Database')
    const { default: Post } = await import('App/Models/Post')
    const trx = await Database.transaction()
    try {
      for (let i = 0; i < 123456789; i++) {
        const post = new Post()
        post.title = `タイトル_${i + 1}`
        post.useTransaction(trx)
        await post.save()
      }

      await trx.commit()
      this.logger.info('success')
    } catch (e) {
      this.logger.error(e.message)
      await trx.rollback()
    }
  }
}
