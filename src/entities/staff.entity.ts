import { Column, Entity } from 'typeorm'
import { User } from './user.entity'
import { BankDetails } from './embedded/bank-details.embedded'
import { CivilStatus } from '../enums'
import { ContactInfo } from './embedded/contact.embedded'

@Entity()
export class Staff extends User {
    @Column()
    postalCode!: string

    @Column({ unique: true })
    nicNo!: string

    @Column()
    nicFrontUrl!: string

    @Column()
    nicBackUrl!: string

    @Column({
        type: 'enum',
        enum: CivilStatus
    })
    civilStatus!: CivilStatus

    @Column(() => ContactInfo)
    secondaryContact!: ContactInfo

    @Column(() => BankDetails)
    bankDetails!: BankDetails

    @Column({ default: false })
    isAdmin!: boolean

    @Column({ default: false })
    isTeacher!: boolean

    @Column({ default: false })
    hasApprovedInformation!: boolean
}
