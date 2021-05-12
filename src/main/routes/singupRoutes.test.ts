import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper'
import app from '../config/app'
import env from '../config/env'

describe('User signup routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await request(app)
      .post('/user')
      .send({
        displayName: 'Brett Wiltshire',
        email: 'brett@email.com',
        password: '123456',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png'
      }).expect(200)
  })
})
