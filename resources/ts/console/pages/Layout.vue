<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'LayoutPage',
  setup() {
    const leftDrawerOpen = ref(false)

    const $route = useRoute()
    const isLoginPage = computed(() => {
      return $route.path === '/console/login'
    })

    return {
      isLoginPage,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  },
})
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn v-if="!isLoginPage" dense flat round icon="mdi-menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-avatar> {} </q-avatar>
          aa
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-if="!isLoginPage" v-model="leftDrawerOpen" show-if-above side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
