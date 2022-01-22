import test from 'japa'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'

test.group('Category', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('isExistName not exist data', async (assert) => {
    const isExist = await Category.isExistName('foobar')
    assert.equal(isExist, false)
  })

  test('isExistName not exist data (with ignoreId, transaction)', async (assert) => {
    const trx = await Database.transaction()
    const isExist = await Category.isExistName('foobar', 1, trx)
    assert.equal(isExist, false)
    await trx.rollback()
  })

  test('isExistName exist data', async (assert) => {
    const category = new Category()
    category.name = 'foobar'
    await category.save()

    const isExist = await Category.isExistName('foobar')
    assert.equal(isExist, true)
  })

  test('isExistName exist data (with ignore)', async (assert) => {
    const category = new Category()
    category.name = 'foobar'
    await category.save()

    const trx = await Database.transaction()

    // 作成したカテゴリ.ID を除いてチェック。
    const isExist1 = await Category.isExistName('foobar', category.id)
    assert.equal(isExist1, false)

    // 作成したカテゴリ.ID ではないデータを除いてチェック。
    const isExist2 = await Category.isExistName('foobar', category.id + 1)
    assert.equal(isExist2, true)
    await trx.rollback()
  })

  test('isExistName exist data (with transaction)', async (assert) => {
    const category = new Category()
    category.name = 'foobar'
    await category.save()

    const trx = await Database.transaction()

    const isExist = await Category.isExistName('foobar', undefined, trx)
    assert.equal(isExist, true)
    await trx.rollback()
  })

  test('isExistName exist data (with ignoreId, transaction)', async (assert) => {
    const category = new Category()
    category.name = 'foobar'
    await category.save()

    const trx = await Database.transaction()
    // 作成したカテゴリ.ID を除いてチェック。
    const isExist1 = await Category.isExistName('foobar', category.id, trx)
    assert.equal(isExist1, false)

    // 作成したカテゴリ.ID ではないデータを除いてチェック。
    const isExist2 = await Category.isExistName('foobar', category.id + 1, trx)
    assert.equal(isExist2, true)
    await trx.rollback()
  })

  test('createCategory', async (assert) => {
    const category1 = await Category.findBy('name', 'foobar')
    assert.isNull(category1)

    await Category.createCategory('foobar')

    const category2 = await Category.findBy('name', 'foobar')
    assert.isNotNull(category2)

    if (category2) {
      assert.equal(category2.name, 'foobar')
    } else {
      assert.fail('category2 is null')
    }
  })

  test('createCategory with transaction', async (assert) => {
    const category1 = await Category.findBy('name', 'foobar')
    assert.isNull(category1)

    const trx = await Database.transaction()

    await Category.createCategory('foobar', trx)

    await trx.commit()

    const category2 = await Category.findBy('name', 'foobar')
    assert.isNotNull(category2)

    if (category2) {
      assert.equal(category2.name, 'foobar')
    } else {
      assert.fail('category2 is null')
    }
  })

  test('createCategory exist name', async (assert) => {
    const category = new Category()
    category.name = 'foobar'
    await category.save()

    try {
      await Category.createCategory('foobar')
      assert.fail('must not success')
    } catch (e) {
      // ok
    }
  })

  test('getByName not exist', async (assert) => {
    const category = await Category.getByName('foobar')
    assert.isNull(category)
  })

  test('getByName not exist (with transaction)', async (assert) => {
    const trx = await Database.transaction()
    const category = await Category.getByName('foobar', trx)
    assert.isNull(category)
    await trx.rollback()
  })

  test('getByName exist', async (assert) => {
    const category1 = new Category()
    category1.name = 'foobar'
    await category1.save()

    const category2 = await Category.getByName('foobar')
    assert.isNotNull(category2)
    if (category2) {
      assert.equal(category2.name, category1.name)
    } else {
      assert.fail('not null')
    }
  })

  test('getByName exist (with transaction)', async (assert) => {
    const category1 = new Category()
    category1.name = 'foobar'
    await category1.save()

    const trx = await Database.transaction()

    const category2 = await Category.getByName('foobar', trx)
    assert.isNotNull(category2)
    if (category2) {
      assert.equal(category2.name, category1.name)
    } else {
      assert.fail('not null')
    }

    await trx.rollback()
  })

  test('destroyCategory not exist', async (assert) => {
    const trx = await Database.transaction()
    try {
      await Category.destroyCategory(9999, trx)
    } catch (e) {
      assert.fail('must not failed')
    }
    await trx.rollback()
  })

  test('destroyCategory exist', async (assert) => {
    const category1 = new Category()
    category1.name = 'foobar'
    await category1.save()

    const trx = await Database.transaction()

    await Category.destroyCategory(category1.id, trx)

    const category2 = await Category.find(category1.id)
    assert.isNull(category2)

    await trx.rollback()
  })
})
