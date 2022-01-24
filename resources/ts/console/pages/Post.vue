<script lang="ts">
import { defineComponent } from 'vue'
import PostTable from '@/console/components/PostTable.vue'

export default defineComponent({
  name: 'PostPage',
  components: {
    PostTable,
  },
})
</script>

<template>
  <div class="row justify-center">
    <div class="col-10">
      <div class="row">
        <div class="col-12">
          <PostTable></PostTable>
        </div>
      </div>
    </div>
  </div>
</template>
