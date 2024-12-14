import { Column } from 'typeorm'

export class TimeSlot {
  @Column()
  day?: string

  @Column({ type: 'timestamp' })
  startTime?: Date

  @Column({ type: 'timestamp' })
  endTime?: Date
}
