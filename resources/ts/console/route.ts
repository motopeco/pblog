import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/console/pages/Home.vue'
import Layout from '@/console/pages/Layout.vue'
import Login from '@/console/pages/Login.vue'

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
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
