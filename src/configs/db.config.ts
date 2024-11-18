import path from 'path'
import { DataSource } from 'typeorm'
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from './env.config'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT) ?? 5432,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [path.join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    migrations: ['dist/src/migrations/*.js'],
    logging: false,
    synchronize: true
})
