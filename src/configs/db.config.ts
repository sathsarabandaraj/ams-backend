import path from 'path'
import { DataSource } from 'typeorm'
import { POSTGRES_DB_NAME, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from './env.config'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: POSTGRES_HOST,
    port: POSTGRES_PORT ?? 5432,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB_NAME,
    entities: [path.join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    migrations: ['dist/src/migrations/*.js'],
    logging: false,
    synchronize: true
})
