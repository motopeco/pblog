import Keyv from 'keyv'

class Cache {
  private readonly store: Keyv

  constructor() {
    this.store = new Keyv()
  }

  public getStore() {
    return this.store
  }
}

export default new Cache()
