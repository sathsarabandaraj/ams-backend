import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './user.entity'
import { Center } from './center.entity'
import { PreferredMode } from '../enums'
import { ContactInfo } from './embedded/contact.embedded'

@Entity()
export class Student extends User {
    @Column()
    school!: string

    @Column()
    grade!: string

    @ManyToOne(() => Center)
    @JoinColumn({ name: 'centerId' })
    nearestCenter!: Center

    @Column({
        type: 'enum',
        enum: PreferredMode,
        default: PreferredMode.ONSITE
    })
    preferredMode!: PreferredMode

    @Column(() => ContactInfo)
    guardian!: ContactInfo

    @Column(() => ContactInfo)
    emergencyContact!: ContactInfo
}