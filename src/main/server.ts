import { MongoHelper } from '../infra/db/mongodb/helpers/mongoHelper'
import app from './config/app'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default

    app.listen(env.port, () => console.log(`Server runing at localhost:${env.port}`))
  })
  .catch(console.error)
