import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import type { Express } from 'express'
import express from 'express'
import studentRoutes from './routes/student.route'
import { AppDataSource } from './configs/db.config'
import i18next from 'i18next'
import path from 'path'
import Backend from 'i18next-fs-backend'
import middleware from 'i18next-http-middleware'  // Changed this import

const app = express()

app.use(
    cors({
        origin: 'http://localhost:*',
        methods: 'GET, HEAD, PUT, PATCH, DELETE',
        credentials: true
    })
)

// Initialize i18next
i18next
    .use(Backend)
    .use(middleware.LanguageDetector)  // Changed this line
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'si'],
        lng: 'en',
        ns: ['translation'],
        defaultNS: 'translation',
        backend: {
            loadPath: path.join(__dirname, './locales/{{lng}}/{{ns}}.json'),
        },
        detection: {
            order: ['cookie', 'header', 'querystring'],
            caches: ['cookie'],
            lookupQuerystring: 'lng',
            lookupCookie: 'i18next',
            lookupHeader: 'accept-language',  // Fixed casing here
        },
        interpolation: {
            escapeValue: false
        },
    });

app.use(middleware.handle(i18next));  // Changed this line
app.use(cookieParser())
app.use(bodyParser.json())
app.get('/', (req, res) => {
    console.log('Current language:', req.language); // Log the current language
    console.log('Translation for rootMsg:', req.t('rootMsg')); // Log the translation for rootMsg

    res.send(req.t('rootMsg')); // This should return the translated message
});

app.use('/api/student', studentRoutes)

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
