<script lang="ts">
import { defineComponent, inject, onMounted, ref } from 'vue'
import { getPosts } from '@/console/model/post'

export default defineComponent({
  name: 'PostTable',
  setup() {
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
    />
  </div>
</template>
