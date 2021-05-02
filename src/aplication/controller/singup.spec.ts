import { MissingParamsError } from '../presentation/errors/missingParamsError'
import { SingUpController } from './singup'

describe('SingUpController', () => {
  test('Should return 400 if no email is provided', () => {
    const controller = new SingUpController()
    const httpResquest = {
      body: {
        displayName: 'Fulano de Tal',
        password: 'one_password'
      }
    }
    const httpResponse = controller.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const controller = new SingUpController()
    const httpResquest = {
      body: {
        displayName: 'Fulano de Tal',
        email: 'oneemail@email.com'
      }
    }
    const httpResponse = controller.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))
  })
})
