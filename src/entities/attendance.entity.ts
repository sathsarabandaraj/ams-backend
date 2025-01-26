import {Column, Entity, JoinColumn, ManyToOne,} from "typeorm";
import {AttendanceInOutStatus} from "../enums";
import {User} from "./user.entity";
import {Rfid} from "./rfid.entity";
import BaseEntity from "./baseEntity";
import {AccessModule} from "./access-module.entity";

@Entity()
export class Attendance extends BaseEntity {
    @Column({type: "enum", enum: AttendanceInOutStatus})
    inOutStatus: AttendanceInOutStatus;

    @ManyToOne(() => User, (user) => user.attendances, {onDelete: "CASCADE"})
    user: User;

    @ManyToOne(() => AccessModule, {nullable: true, onDelete: "SET NULL"})
    @JoinColumn({name: 'accessModuleId'})
    accessModule?: AccessModule;

    @ManyToOne(() => Rfid, {nullable: true, onDelete: "SET NULL"})
    @JoinColumn({name: 'rfidId'})
    rfid?: Rfid;
}
