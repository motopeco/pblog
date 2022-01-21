declare interface BlogPagePaginateQuery {
  p: number
}

declare interface PaginateResult {
  total: number
  datum: any[]
  page: number
  totalPage: number
}
