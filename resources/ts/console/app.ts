import * as Vue from 'vue'
import * as QuasarFramework from 'quasar'
import * as Japanese from 'quasar/lang/ja'
import * as MdiV6 from 'quasar/icon-set/mdi-v6'
import router from '@/console/route'

const app = Vue.createApp({
  template: '<router-view></router-view>',
})

const Quasar = QuasarFramework.Quasar

Quasar.lang.set(Japanese.default)
Quasar.iconSet.set(MdiV6.default)

app.use(Quasar)
app.use(router)
app.mount('#app')
