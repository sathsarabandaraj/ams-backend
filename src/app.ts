import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import type { Express, Request, Response } from 'express'
import express from 'express'
import attendanceRoutes from './routes/attendance.route'
import hardwareRoutes from './routes/hardware.route'
import studentRoutes from './routes/student.route'
import staffRoutes from './routes/staff.route'
import authRoutes from './routes/auth.route'
import rfidRoutes from './routes/rfid.route'
import { AppDataSource } from './configs/db.config'
import i18next from 'i18next'
import path from 'path'
import Backend from 'i18next-fs-backend'
import middleware from 'i18next-http-middleware'
import passport from 'passport'
import { configurePassport } from './configs/passport.config'
import dashboardRoutes from './routes/dashboard.routes'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:3001', // Set to the exact frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed methods
    credentials: true, // Include credentials like cookies if necessary
  })
);

// Initialize i18next
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'si', 'ta'],
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: path.join(__dirname, './locales/{{lng}}/{{ns}}.json')
    },
    detection: {
      order: ['header', 'cookie'],
      caches: ['cookie'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupHeader: 'Accept-Language'
    },
    interpolation: {
      escapeValue: false
    }
  })
  .then(() => {
    app.use(middleware.handle(i18next))
  })
  .catch((err) => {
    console.error('Error initializing i18next:', err)
  })

app.use(middleware.handle(i18next))
app.use(cookieParser())
app.use(bodyParser.json())

app.use(passport.initialize())
configurePassport(passport)

app.use('/static', express.static(path.join(__dirname, '../public')))

app.post('/api/set-language', async (req: Request, res: Response) => {
  const lang = req.query.lang // Get the language from query parameter
  if (lang) {
    res.cookie('i18next', lang) // Set the language in a cookie
    res.redirect(req.get('Referrer') ?? '/') // Redirect back to the referring page or home
  }
})

app.get('/', (req, res) => {
  res.send(req.t('rootMsg'))
})

app.use('/api/auth', authRoutes)
app.use('/api/rfid', rfidRoutes)
app.use('/api/staff', staffRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/hardware', hardwareRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes)

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: req.t('default.routeNotFound')
  })
})

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
