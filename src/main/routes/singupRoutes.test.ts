import request from 'supertest'
import app from '../config/app'

describe('User signup routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/user')
      .send({
        displayName: 'Brett Wiltshire',
        email: 'brett@email.com',
        password: 123456,
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png'
      })
      .expect(200)
  })
})
