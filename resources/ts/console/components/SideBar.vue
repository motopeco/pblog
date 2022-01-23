<script lang="ts">
import { defineComponent, inject } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { getLogout } from '@/console/model/login'

export default defineComponent({
  name: 'SideBar',
  setup() {
    const $q = useQuasar()
    const axios: any = inject('axios')
    const $router = useRouter()

    const logout = getLogout($q, axios, $router)

    const links = [
      { name: 'ホーム', path: '/console' },
      { name: '投稿管理', path: '/console/posts' },
      { name: 'カテゴリー管理', path: '/console/categories' },
      { name: 'ユーザー管理', path: '/console/users' },
    ]

    return {
      links,
      logout,
    }
  },
})
</script>

<template>
  <div>
    <q-list separator>
      <q-item v-for="(link, k) of links" :key="k" v-ripple clickable :to="link.path">
        <q-item-section>{{ link.name }}</q-item-section>
      </q-item>
      <q-separator spaced />
      <q-item v-ripple clickable @click="logout">
        <q-item-section>ログアウト</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
