import { Entity, Column, ManyToOne, ManyToMany } from 'typeorm'
import BaseEntity from './baseEntity'
import { Batch } from './batch.entity'
import { Staff } from './staff.entity'
import { ClassStatus } from '../enums'
import { Topic } from './topic.entity'

@Entity('class')
export class Class extends BaseEntity {
  @Column()
  startDateTime!: Date

  @Column()
  endDateTime!: Date

  @Column({
    type: 'enum',
    enum: ClassStatus,
    default: ClassStatus.SCHEDULED
  })
  status!: ClassStatus

  @Column({ nullable: true })
  reason?: string

  @ManyToOne(() => Batch, (batch) => batch.classes, { onDelete: 'CASCADE' })
  batch: Batch

  @ManyToMany(() => Staff, { nullable: true })
  assignedTeacher?: Staff[]

  @ManyToMany(() => Topic, { nullable: true })
  topics!: Topic[]
}
