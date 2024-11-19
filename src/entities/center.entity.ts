import { Column, Entity } from 'typeorm'
import BaseEntity from './baseEntity'
import { ContactInfo } from './embedded/contact.embedded'

@Entity('centers')
export class Center extends BaseEntity {
    @Column()
    name!: string

    @Column({ unique: true })
    code!: string
        
    @Column()
    address!: string

    @Column(() => ContactInfo)
    contactPerson!: ContactInfo

    @Column({ nullable: true })
    description?: string

    @Column({ default: true })
    isActive!: boolean

    @Column({ nullable: true })
    location?: string
}
