<script lang="ts">
import { defineComponent, inject, ref } from 'vue'
import { getLogin, loginRules } from '@/console/model/login'
import { useQuasar, QForm } from 'quasar'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const axios: any = inject('axios')
    const $q = useQuasar()
    const $router = useRouter()
    const form = ref<QForm>()
    const email = ref<string>('')
    const password = ref<string>('')
    const rules = loginRules

    const login = getLogin(email, password, form, $q, axios, $router)
    const reset = () => {
      email.value = ''
      password.value = ''
      form.value?.resetValidation()
    }

    return {
      form,
      email,
      password,
      login,
      reset,
      rules,
    }
  },
})
</script>

<template>
  <div class="row justify-center q-mt-md">
    <div class="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-3">
      <q-card>
        <q-card-section>
          <div class="row">
            <div class="col-12 text-h6 text-center">
              <span>ログイン</span>
            </div>
            <div class="col-12">
              <q-form ref="form" class="q-gutter-lg q-mt-lg" @submit="login" @reset="reset">
                <q-input
                  v-model="email"
                  filled
                  label="メールアドレス"
                  :rules="rules.email"
                  model-value=""
                />
                <q-input
                  v-model="password"
                  type="password"
                  filled
                  label="パスワード"
                  :rules="rules.password"
                  model-value=""
                />

                <div class="row">
                  <div class="col-6">
                    <q-btn label="ログイン" type="submit" color="primary" />
                  </div>
                  <div class="col-6 text-right">
                    <q-btn label="リセット" type="reset" />
                  </div>
                </div>
              </q-form>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
