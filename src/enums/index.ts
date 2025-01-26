export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum CivilStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed'
}

export enum PreferredMode {
  ONLINE = 'online',
  ONSITE = 'onsite'
}

export enum UserType {
  STAFF = 'staff',
  STUDENT = 'student'
}

export enum AccoutStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  DELETED = 'deleted',
  PENDING = 'pending'
}

export enum Roles {
  STUDENT = 'student',
  STAFF_ADMIN = 'staff-admin',
  STAFF_NONADMIN = 'staff-nonadmin'
}

export enum BatchStatus {
  TO_BE_STARTED = 'to-be-started',
  ONGOING = 'ongoing',
  FINISHED = 'finished',
  STALLED = 'stalled'
}

export enum ClassStatus {
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
  RESCHEDULED = 'rescheduled'
}

export enum EnrollmentStatus {
  ENROLLED = 'enrolled',
  DROPPED = 'dropped',
  COMPLETED = 'completed'
}

export enum AttendanceInOutStatus {
  IN = 'in',
  OUT = 'out'
}
