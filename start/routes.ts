/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
  Route.get('posts', 'Api/BlogPageController.paginate')
  Route.post('login', 'Api/AuthController.login')
}).prefix('/api/v1')

Route.group(() => {
  Route.get('posts', 'Api/BlogManagerController.paginate')
  Route.post('posts', 'Api/BlogManagerController.storePost')
  Route.get('posts/:postId', 'Api/BlogManagerController.getPost')
  Route.put('posts/:postId', 'Api/BlogManagerController.updatePost')
  Route.delete('posts/:postId', 'Api/BlogManagerController.destroyPost')
  Route.get('posts/:postId/histories', 'Api/BlogManagerController.postHistoryPaginate')
  Route.get('posts/:postId/histories/:historyId', 'Api/BlogManagerController.getPostHistory')
  Route.post('posts/:postId/histories/:historyId/copy', 'Api/BlogManagerController.copyPostHistory')
  Route.get('categories', 'Api/BlogManagerController.categoryPaginate')
  Route.post('categories', 'Api/BlogManagerController.storeCategory')
  Route.get('categories/:id', 'Api/BlogManagerController.getCategory')
  Route.put('categories/:id', 'Api/BlogManagerController.updateCategory')
  Route.delete('categories/:id', 'Api/BlogManagerController.destroyCategory')
})
  .prefix('/api/v1/console')
  .middleware('auth')

Route.get('/', 'HomeController.index')

Route.get('/console/login', 'ConsoleController.index')

Route.group(() => {
  Route.get('/', 'ConsoleController.index')
  Route.get('/*', 'ConsoleController.index')
})
  .prefix('/console')
  .middleware('auth')

// Route.get('/', async ({ view }) => {
//   return view.render('welcome')
// })
