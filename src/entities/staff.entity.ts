import { Entity, OneToOne, JoinColumn, Column } from "typeorm";
import { CivilStatus } from "../enums";
import { BankDetails } from "./embedded/bank-details.embedded";
import { ContactInfo } from "./embedded/contact.embedded";
import { User } from "./user.entity";
import BaseEntity from "./baseEntity";

@Entity()
export class Staff extends BaseEntity{
    @OneToOne(() => User, user => user.staff)
    user: User;

    @Column()
    postalCode: string;

    @Column({ unique: true })
    nicNo: string;

    @Column()
    nicFrontUrl: string;

    @Column()
    nicBackUrl: string;

    @Column({
        type: 'enum',
        enum: CivilStatus
    })
    civilStatus: CivilStatus;

    @Column(() => ContactInfo)
    secondaryContact: ContactInfo;

    @Column(() => BankDetails)
    bankDetails: BankDetails;

    @Column({ default: false })
    isAdmin: boolean;

    @Column({ default: false })
    isTeacher: boolean;

    @Column({ default: false })
    hasApprovedInformation: boolean;
}
