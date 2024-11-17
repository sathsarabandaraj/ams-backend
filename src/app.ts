import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import type { Express } from 'express'
import express from 'express'

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

export const startServer = async (port: number) => {
    console.log(`Server is starting on port ${port}`)
}

export default startServer


