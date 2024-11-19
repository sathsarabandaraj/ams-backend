import {
    Entity,
    Column,
    JoinColumn,
    ManyToOne,
    BeforeInsert,
    Index,
} from 'typeorm';
import { AccoutStatus, Gender, UserType } from '../enums';
import BaseEntity from './baseEntity';
import { Center } from './center.entity';

const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

@Entity()
export class User extends BaseEntity {
    @Index()
    @Column({ unique: true })
    systemId: string;

    @Column()
    email: string;

    @Column()
    nameInFull: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    address: string;

    @Column()
    contactNo: string;

    @Column({
        type: 'enum',
        enum: Gender
    })
    gender: Gender;

    @Column({ type: 'date' })
    dob: Date;

    @Column({ select: false })
    password: string;

    @Column({ type: 'enum', enum: AccoutStatus })
    accountStatus: boolean;

    @Column({ type: 'enum', enum: UserType })
    userType: UserType

    @ManyToOne(() => Center)
    @JoinColumn({ name: 'centerId' })
    mainCenter: Center;

    @BeforeInsert()
    async generateSystemId() {
        const centerPrefix = this.mainCenter?.code?.toLowerCase() || 'unk';
        const userType = this.userType === UserType.STUDENT ? 'stu' : 'sta';

        let uniqueId = '';
        const charactersLength = characters.length;

        for (let i = 0; i < 4; i++) {
            uniqueId += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        this.systemId = `${centerPrefix}-${userType}-${uniqueId}`;
    }
}
