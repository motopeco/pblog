import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomePage from '@/console/pages/HomePage.vue'
import LayoutPage from '@/console/pages/LayoutPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/console',
    component: LayoutPage,
    children: [
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
