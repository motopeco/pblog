import test from 'japa'
import Post from 'App/Models/Post'
import Database from '@ioc:Adonis/Lucid/Database'
import PostHistory from 'App/Models/PostHistory'
import Category from 'App/Models/Category'
import CategoryPost from 'App/Models/CategoryPost'

test.group('Post', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('post boundary', async () => {
    const data = await Post.getPaginate({ p: 1 })
    console.log(data)
  })

  test('createPost empty category', async (assert) => {
    const trx = await Database.transaction()

    const title = 'タイトル'
    const content = '本文XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

    await Post.createPost(title, content, [], trx)

    await trx.commit()

    const post = await Post.findBy('title', title)
    assert.isNotNull(post)

    if (!post) {
      return assert.fail('not null')
    }

    assert.equal(post.title, title)

    const history = await PostHistory.find(post.currentPostHistoryId)
    assert.isNotNull(history)

    if (!history) {
      return assert.fail('not null')
    }

    assert.equal(history.content, content)
  })

  test('createPost with new category', async (assert) => {
    const trx = await Database.transaction()

    const title = 'タイトル'
    const content = '本文XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    const categoryDatum = [{ name: 'foobar' }, { name: 'hogehoge' }]

    await Post.createPost(title, content, categoryDatum, trx)

    await trx.commit()

    const post = await Post.findBy('title', title)
    assert.isNotNull(post)

    if (!post) {
      return assert.fail('not null')
    }

    assert.equal(post.title, title)

    const history = await PostHistory.find(post.currentPostHistoryId)
    assert.isNotNull(history)

    if (!history) {
      return assert.fail('not null')
    }

    assert.equal(history.content, content)

    const foobarCategory = await Category.getByName('foobar')
    assert.isNotNull(foobarCategory)

    const hogehogeCategory = await Category.getByName('hogehoge')
    assert.isNotNull(hogehogeCategory)

    if (!foobarCategory || !hogehogeCategory) {
      return assert.fail('not null')
    }

    const categoryPost1 = await CategoryPost.query()
      .where('post_id', post.id)
      .andWhere('category_id', foobarCategory.id)
      .first()
    assert.isNotNull(categoryPost1)

    const categoryPost2 = await CategoryPost.query()
      .where('post_id', post.id)
      .andWhere('category_id', hogehogeCategory.id)
      .first()
    assert.isNotNull(categoryPost2)
  })

  test('createPost with new category and exist category', async (assert) => {
    // foobarのカテゴリだけ事前に作成する。
    const foobarCategory = await Category.createCategory('foobar')

    const trx = await Database.transaction()

    const title = 'タイトル'
    const content = '本文XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    const categoryDatum = [{ name: 'foobar' }, { name: 'hogehoge' }]

    await Post.createPost(title, content, categoryDatum, trx)

    await trx.commit()

    const post = await Post.findBy('title', title)
    assert.isNotNull(post)

    if (!post) {
      return assert.fail('not null')
    }

    assert.equal(post.title, title)

    const history = await PostHistory.find(post.currentPostHistoryId)
    assert.isNotNull(history)

    if (!history) {
      return assert.fail('not null')
    }

    assert.equal(history.content, content)

    const hogehogeCategory = await Category.getByName('hogehoge')
    assert.isNotNull(hogehogeCategory)

    if (!foobarCategory || !hogehogeCategory) {
      return assert.fail('not null')
    }

    const categoryPost1 = await CategoryPost.query()
      .where('post_id', post.id)
      .andWhere('category_id', foobarCategory.id)
      .first()
    assert.isNotNull(categoryPost1)

    const categoryPost2 = await CategoryPost.query()
      .where('post_id', post.id)
      .andWhere('category_id', hogehogeCategory.id)
      .first()
    assert.isNotNull(categoryPost2)
  })
})
