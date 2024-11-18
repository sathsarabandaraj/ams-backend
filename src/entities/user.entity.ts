import { Column, Entity, TableInheritance } from 'typeorm'
import BaseEntity from './baseEntity'
import { Gender } from '../enums'

@Entity('users')
@TableInheritance({ column: { type: "varchar", name: "userType" } })
export class User extends BaseEntity {
    @Column()
    email!: string

    @Column()
    nameInFull!: string

    @Column()
    firstName!: string

    @Column()
    lastName!: string

    @Column()
    address!: string

    @Column()
    contactNo!: string

    @Column({
        type: 'enum',
        enum: Gender
    })
    gender!: Gender

    @Column({ type: 'date' })
    dob!: Date

    @Column({ select: false })
    password!: string

    @Column({ default: true })
    isActive!: boolean
}
