import {Column, Entity, Index,} from 'typeorm';
import BaseEntity from './baseEntity';

@Entity()
export class AccessModule extends BaseEntity {
    @Index()
    @Column({unique: true})
    macAddress: string;

    @Column({nullable: true})
    deviceName?: string;

    @Column({nullable: true})
    deviceModel?: string;

    @Column({nullable: true})
    name?: string;

    @Column({nullable: true})
    description?: string;

    @Column({default: true})
    isActive: boolean;

    @Column({type: 'jsonb', default: () => "'{}'", nullable: true})
    metadata?: Record<string, any>;

    // @BeforeInsert()
    // validateMacAddress(): void {
    //     const macRegex = /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/;
    //     if (!macRegex.test(this.macAddress)) {
    //         throw new Error('Invalid MAC address format.');
    //     }
    // }
}
