import {
    Entity,
    Column,
    JoinColumn,
    ManyToOne,
    BeforeInsert,
    Index,
    OneToOne,
    Check,
} from 'typeorm';
import { AccoutStatus, Gender, UserType } from '../enums';
import BaseEntity from './baseEntity';
import { Center } from './center.entity';
import { Staff } from './staff.entity';
import { Student } from './student.entity';

const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

@Check(`"userType" = '${UserType.STUDENT}' AND "studentId" IS NOT NULL AND "staffId" IS NULL 
    OR "userType" = '${UserType.STAFF}' AND "staffId" IS NOT NULL AND "studentId" IS NULL`)
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
    accountStatus: AccoutStatus;

    @Column({ type: 'enum', enum: UserType })
    userType: UserType

    @ManyToOne(() => Center)
    @JoinColumn({ name: 'centerId' })
    mainCenter: Center;

    @OneToOne(() => Student, student => student.user, {
        nullable: true,
        cascade: true,
        eager: false
    })
    @JoinColumn({ name: 'studentId' })
    student?: Student;

    @OneToOne(() => Staff, staff => staff.user, {
        nullable: true,
        cascade: true,
        eager: false
    })

    @JoinColumn({ name: 'staffId' })
    staff?: Staff;

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
