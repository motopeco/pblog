import { Ref } from 'vue'
import { QForm, QVueGlobals } from 'quasar'
import validator from 'validator'
import { Axios } from 'axios'
import { Router } from 'vue-router'

/**
 * ログイン処理
 * @param email
 * @param password
 * @param form
 * @param $q
 * @param axios
 * @param $router
 */
export function getLogin(
  email: Ref<string>,
  password: Ref<string>,
  form: Ref<QForm | undefined>,
  $q: QVueGlobals,
  axios: Axios,
  $router: Router
) {
  return async function () {
    try {
      $q.loading.show()

      await axios.post('/api/v1/login', {
        email: email.value,
        password: password.value,
      })

      form.value?.reset()

      await $router.push('/console')
    } catch (e) {
      $q.notify({
        message: 'ログインに失敗しました',
        position: 'top',
        color: 'warning',
      })
    } finally {
      $q.loading.hide()
    }
  }
}

export const loginRules = {
  email: [
    (val: string) => {
      return !!val || 'メールアドレスは必須です'
    },
    (val: string) => {
      return validator.isEmail(val) || 'メールアドレスを入力してください'
    },
  ],
  password: [
    (val: string) => {
      return !!val || 'パスワードは必須です'
    },
  ],
}
