import { Column } from 'typeorm'

export class BankDetails {
    @Column()
    accountHolderName?: string

    @Column()
    accountNo?: string

    @Column()
    bankName?: string

    @Column()
    branchName?: string
}