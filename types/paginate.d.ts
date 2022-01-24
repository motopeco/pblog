declare interface BlogPagePaginateQuery {
  p: number
  sortBy: 'created_at'
  descending: boolean
}

declare interface PaginateResult {
  total: number
  datum: any[]
  page: number
  totalPage: number
  sortBy: string
  descending: boolean
}
