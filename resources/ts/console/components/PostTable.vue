<script lang="ts">
import { defineComponent, inject, onMounted, ref } from 'vue'
import { getPosts } from '@/console/model/post'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PostTable',
  setup() {
    const $router = useRouter()
    const axios: any = inject('axios')
    const rows = ref([])
    const columns = [
      { name: 'title', field: 'title', align: 'left', label: 'タイトル', sortable: false },
      { name: 'created_at', field: 'created_at', align: 'left', label: '投稿日時', sortable: true },
    ]
    const pagination = ref({})
    const loading = ref(true)

    const request = getPosts(rows, pagination, loading, axios)

    onMounted(async () => {
      await request(null)
    })

    return {
      $router,
      rows,
      columns,
      pagination,
      loading,
      request,
    }
  },
})
</script>

<template>
  <div>
    <q-table
      v-model:pagination="pagination"
      title="投稿"
      flat
      :rows="rows"
      :columns="columns"
      row-key="name"
      :loading="loading"
      @request="request"
    >
      <template #top="">
        <div class="col-5">
          <span class="text-h5">投稿</span>
        </div>
        <div class="col-7 text-right">
          <q-btn color="primary" @click="$router.push('/console/posts/create')">作成</q-btn>
        </div>
      </template>
    </q-table>
  </div>
</template>
