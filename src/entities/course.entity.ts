import { Entity, Column, OneToMany, Index } from 'typeorm'
import BaseEntity from './baseEntity'
import { Batch } from './batch.entity'
import { Topic } from './topic.entity'

@Entity('course')
export class Course extends BaseEntity {
  @Column()
  title!: string

  @Index()
  @Column({ unique: true })
  courseId!: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ default: false })
  isActive!: boolean

  @Column()
  duration!: number

  @Column()
  classCount!: number

  @Column()
  classDuration!: number

  @OneToMany(() => Topic, (topic) => topic.course, { cascade: true })
  topics: Topic[]

  @OneToMany(() => Batch, (batch) => batch.course)
  batches: Batch[]
}
