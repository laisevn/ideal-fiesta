import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper'
import app from '../config/app'
import env from '../config/env'

describe('User signup', () => {
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

let accountCollection = MongoHelper.getCollection('accounts')

describe('User signup login', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return 200 on a login', async () => {
    await accountCollection.insertOne({
      displayName: 'Brett Wiltshire',
      email: 'brett@email.com',
      password: '123456'
    })
    await request(app)
      .post('/login')
      .send({
        email: 'brett@email.com',
        password: '123456',
      }).expect(200)
  })
})