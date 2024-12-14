import { Entity, Column, ManyToOne, OneToMany } from 'typeorm'
import BaseEntity from './baseEntity'
import { Course } from './course.entity'

@Entity('topic')
export class Topic extends BaseEntity {
  @Column()
  name!: string

  @ManyToOne(() => Course, (course) => course.topics, { onDelete: 'CASCADE' })
  course: Course

  @ManyToOne(() => Topic, (topic) => topic.subTopics, { nullable: true })
  parentTopic?: Topic

  @OneToMany(() => Topic, (topic) => topic.parentTopic)
  subTopics: Topic[]

  @Column()
  level!: number

  @Column({ nullable: true })
  description?: string

  @Column({ nullable: true })
  duration?: number

  @Column({ type: 'json', nullable: true })
  content?: JSON
}
