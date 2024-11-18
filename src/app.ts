import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import type { Express } from 'express'
import express from 'express'
import studentRoutes from './routes/student.route'
import { AppDataSource } from './configs/db.config'

const app = express()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(
    cors({
        origin: 'http://localhost:*',
        methods: 'GET, HEAD, PUT, PATCH, DELETE',
        credentials: true
    })
)

app.get('/', (req, res) => {
    res.send('AMS Backend')
})

app.use('/api', studentRoutes)

export const startServer = async (port: number): Promise<Express> => {
    try {
        await AppDataSource.initialize()
        console.log('DB connection is successful')
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`)
        })

        return app
    } catch (err) {
        console.log('DB connection was not successful', err)
        throw err
    }
}

export default startServer


