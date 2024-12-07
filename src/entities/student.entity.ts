import { Entity, OneToOne, JoinColumn, Column, ManyToOne } from "typeorm";
import { PreferredMode } from "../enums";
import { ContactInfo } from "./embedded/contact.embedded";
import { User } from "./user.entity";
import BaseEntity from "./baseEntity";

@Entity()
export class Student extends BaseEntity{
    @OneToOne(() => User, user => user.student)
    user: User;

    @Column()
    school?: string;

    @Column()
    grade?: string;

    @Column({
        type: 'enum',
        enum: PreferredMode,
        default: PreferredMode.ONSITE
    })
    preferredMode?: PreferredMode;

    @Column(() => ContactInfo)
    guardian?: ContactInfo;

    @Column(() => ContactInfo)
    emergencyContact?: ContactInfo;
}
