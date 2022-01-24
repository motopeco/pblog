import { Ref } from 'vue'
import { Axios } from 'axios'
import { DateTime } from 'luxon'

export function getPosts(
  rows: Ref<any[]>,
  pagination: Ref<{}>,
  loading: Ref<boolean>,
  axios: Axios
) {
  return async function (value: any) {
    try {
      loading.value = true

      const params = {
        p: 1,
        sortBy: 'created_at',
        descending: false,
      }

      if (value) {
        console.log(value)
        params.p = value.pagination.page
        params.sortBy = value.pagination.sortBy || 'created_at'

        if (value.pagination.sortBy) {
          params.descending = value.pagination.descending
        } else {
          params.descending = false
        }
      }

      const resp = await axios.get('/api/v1/console/posts', {
        params,
      })

      const data = resp.data as PaginateResult

      rows.value = data.datum.map((v) => {
        v.created_at = DateTime.fromISO(v.created_at).toFormat('yyyy/LL/dd HH:mm:ss.SSS')
        return v
      })

      pagination.value = {
        sortBy: data.sortBy,
        descending: data.descending,
        page: data.page,
        rowsPerPage: 10,
        rowsNumber: data.total,
      }

      console.log(resp)
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }
}
