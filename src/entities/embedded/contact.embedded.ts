import { Column } from 'typeorm'

export class ContactInfo {
    @Column()
    name!: string

    @Column()
    relationship!: string

    @Column()
    contactNo!: string

    @Column({ nullable: true })
    email?: string
}
