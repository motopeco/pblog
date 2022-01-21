import test from 'japa'
import Post from 'App/Models/Post'
import Database from '@ioc:Adonis/Lucid/Database'

test('post boundary', async (assert) => {
  const data = await Post.getPaginate({ p: 1 })
  console.log(data)
})
