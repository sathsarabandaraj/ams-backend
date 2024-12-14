import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  Index
} from 'typeorm'
import BaseEntity from './baseEntity'
import { Course } from './course.entity'
import { Staff } from './staff.entity'
import { Class } from './class.entity'
import { Enrollment } from './enrollement.entity'
import { BatchStatus } from '../enums'
import { TimeSlot } from './embedded/time-slot.embedded'
import { Center } from './center.entity'

@Entity('batch')
export class Batch extends BaseEntity {
  @Column({
    type: 'enum',
    enum: BatchStatus,
    default: BatchStatus.TO_BE_STARTED
  })
  status!: BatchStatus

  @Index()
  @Column({ unique: true })
  batchId!: string

  @Column()
  batchStartDate!: Date

  @Column()
  batchEndDate!: Date

  @Column(() => TimeSlot)
  timeSlot: TimeSlot

  @ManyToOne(() => Course, (course) => course.batches, { onDelete: 'CASCADE' })
  course: Course

  @OneToMany(() => Class, (classes) => classes.batch, { cascade: true })
  classes: Class[]

  @OneToMany(() => Enrollment, (enrollment) => enrollment.batch, {
    cascade: true
  })
  enrollments: Enrollment[]

  @ManyToMany(() => Staff, { nullable: true })
  assignedTeachers?: Staff[]

  @ManyToOne(() => Center, { onDelete: 'CASCADE', nullable: false })
  center: Center
}
