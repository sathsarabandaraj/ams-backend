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

interface IUserUpdate {
    uuid?: string
    firstName?: string
    lastName?: string
    email?: string
    address?: string
    contactNo?: string
    gender?: string
    dob?: string
    accountStatus?: string
    userType?: string
}

export interface IStudentUpdate {
    uuid?: string
    school?: string
    grade?: string
    preferredMode?: string
    guardian?: {
        name?: string
        relationship?: string
        contactNo?: string
        email?: string
    }
    emergencyContact?: {
        name?: string
        relationship?: string
        contactNo?: string
        email?: string
    }
    user?: IUserUpdate
}
