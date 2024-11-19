export interface ApiResponse<T> {
    statusCode: number
    message?: string
    data?: T | null
}

export interface PaginatedApiResponse<TItem> {
    pageNumber: number
    pageSize: number
    totalItemCount: number
    items: TItem[]
    statusCode: number
    message: string
}

