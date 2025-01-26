import {Check, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne} from 'typeorm'
import {AccoutStatus, Gender, UserType} from '../enums'
import BaseEntity from './baseEntity'
import {Center} from './center.entity'
import {Staff} from './staff.entity'
import {Student} from './student.entity'
import {Rfid} from './rfid.entity'
import {Attendance} from './attendance.entity'

@Check(`"userType" = '${UserType.STUDENT}' AND "studentId" IS NOT NULL AND "staffId" IS NULL 
    OR "userType" = '${UserType.STAFF}' AND "staffId" IS NOT NULL AND "studentId" IS NULL`)
@Entity()
export class User extends BaseEntity {
  @Index()
  @Column({ unique: true })
  systemId: string

  @Column()
  email: string

  @Column()
  nameInFull: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  address: string

  @Column()
  contactNo: string

  @Column({
    type: 'enum',
    enum: Gender
  })
  gender: Gender

  @Column({ type: 'date' })
  dob: Date

  @Column({ select: false })
  password: string

  @Column({ type: 'enum', enum: AccoutStatus })
  accountStatus: AccoutStatus

  @Column({ type: 'enum', enum: UserType })
  userType: UserType

  @ManyToOne(() => Center)
  @JoinColumn({ name: 'centerId' })
  mainCenter: Center

  @OneToOne(() => Student, (student) => student.user, {
    nullable: true,
    cascade: true,
    eager: false
  })
  @JoinColumn({ name: 'studentId' })
  student?: Student

  @OneToOne(() => Staff, (staff) => staff.user, {
    nullable: true,
    cascade: true,
    eager: false
  })
  @JoinColumn({name: 'staffId', referencedColumnName: 'uuid'})
  staff?: Staff

  @OneToMany(() => Rfid, (rfid) => rfid.user)
  rfids: Rfid[];

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances: Attendance[];
}
