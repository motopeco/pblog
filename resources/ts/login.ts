import * as Vue from 'vue'
import LoginPage from '@/pages/LoginPage.vue'
//
const app = Vue.createApp({
  template: '<LoginPage></LoginPage>',
})

app.component('LoginPage', LoginPage)

app.mount('#app')
