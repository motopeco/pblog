import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/console/pages/Home.vue'
import Layout from '@/console/pages/Layout.vue'
import Login from '@/console/pages/Login.vue'
import Post from '@/console/pages/Post.vue'
import Category from '@/console/pages/Category.vue'
import User from '@/console/pages/User.vue'
import Create from '@/console/pages/posts/Create.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/console',
    component: Layout,
    children: [
      {
        path: 'login',
        component: Login,
      },
      {
        path: '',
        component: Home,
      },
      {
        path: 'posts',
        component: Post,
      },
      {
        path: 'posts/create',
        component: Create,
      },
      {
        path: 'categories',
        component: Category,
      },
      {
        path: 'users',
        component: User,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
