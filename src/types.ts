export interface IApiResult<T> {
    statusCode: number
    message?: string | 'default.message'
    data?: T | null
}

export interface IPaginatedApiResult<T> {
    statusCode: number
    message: string
    pageNumber: number
    pageSize: number
    totalItemCount: number
    items: T[]
}

