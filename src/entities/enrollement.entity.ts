import { Entity, Column, ManyToOne } from 'typeorm'
import BaseEntity from './baseEntity'
import { User } from './user.entity'
import { Batch } from './batch.entity'
import { EnrollmentStatus } from '../enums'

@Entity('enrollment')
export class Enrollment extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  student: User

  @ManyToOne(() => Batch, (batch) => batch.enrollments, { onDelete: 'CASCADE' })
  batch: Batch

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ENROLLED
  })
  status!: EnrollmentStatus

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enrolledAt!: Date
}
