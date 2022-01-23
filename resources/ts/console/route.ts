import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomePage from '@/console/pages/HomePage.vue'
import LayoutPage from '@/console/pages/LayoutPage.vue'
import LoginPage from '@/console/pages/LoginPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/console',
    component: LayoutPage,
    children: [
      {
        path: 'login',
        component: LoginPage,
      },
      {
        path: '',
        component: HomePage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
