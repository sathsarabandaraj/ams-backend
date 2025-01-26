import {Column, Entity, Index, JoinColumn, ManyToOne,} from 'typeorm';
import BaseEntity from './baseEntity';
import {User} from './user.entity';

@Entity()
export class Rfid extends BaseEntity {
    @Index()
    @Column({unique: true})
    rfidTag: string;

    @Column({default: false})
    isSystem?: boolean;

    @ManyToOne(() => User, (user) => user.rfids, {nullable: true, onDelete: 'SET NULL',})
    @JoinColumn({name: 'userId'})
    user?: User;

    @Column({type: 'jsonb', default: () => "'{}'"})
    metadata: Record<string, any>;
}
