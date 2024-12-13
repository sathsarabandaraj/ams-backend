import startServer from './app'
import { SERVER_PORT } from './configs/env.config'

async function start(): Promise<void> {
  try {
    await startServer(SERVER_PORT)
    console.log('Server started!')
  } catch (err) {
    console.error('Something went wrong!', err)
  }
}

start().catch((err) => {
  console.error(err)
})
