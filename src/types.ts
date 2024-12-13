import { type CivilStatus } from './enums/index'
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

export interface IUserUpdate {
  uuid?: string
  nameInFull?: string
  firstName?: string
  lastName?: string
  email?: string
  address?: string
  contactNo?: string
  gender?: string
  dob?: string
  accountStatus?: string
  userType?: string
  mainCenter?: string
  student?: Partial<IStudentUpdate>
  Staff?: Partial<IStaffUpdate>
}

interface IStudentUpdate {
  uuid?: string
  school?: string
  grade?: string
  preferredMode?: string
  emergencyContact?: Partial<IContactInfoUpdate>
  guardian?: Partial<IContactInfoUpdate>
}

interface IStaffUpdate {
  postalCode?: string
  nicNo?: string
  nicFrontUrl?: string
  nicBackUrl?: string
  civilStatus?: CivilStatus
  secondaryContact?: Partial<IContactInfoUpdate>
  bankDetails?: Partial<IBankDetails>
  isTeacher?: boolean
  hasApprovedInformation?: boolean
}

interface IContactInfoUpdate {
  name?: string
  relationship?: string
  address?: string
  contactNo?: string
}

interface IBankDetails {
  accountHoderName?: string
  accountNo?: string
  bankName?: string
  branchName?: string
}
