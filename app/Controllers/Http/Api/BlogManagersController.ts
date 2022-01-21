import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * ブログ管理コンソール用API
 */
export default class BlogManagersController {
  /**
   * ポスト一覧表示用
   */
  public async paginate() {}

  /**
   * カテゴリ一覧表示用
   */
  public async categoryPaginate() {}

  /**
   * ポスト作成
   */
  public async storePost() {}

  /**
   * ポスト情報取得
   */
  public async getPost() {}

  /**
   * ポスト更新
   */
  public async updatePost() {}

  /**
   * ポスト削除
   */
  public async destroyPost() {}

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
  public async storeCategory() {}

  /**
   * カテゴリー情報取得
   * カテゴリーに関連付けられたポスト一覧も取得できる。
   */
  public async getCategory() {}

  /**
   * カテゴリー更新
   */
  public async updateCategory() {}

  /**
   * カテゴリー削除
   */
  public async destroyCategory() {}
}
