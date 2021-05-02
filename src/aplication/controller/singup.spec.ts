import { MissingParamsError } from '../presentation/errors/missingParamsError'
import { SingUpController } from './singup'
import { InvalidParamsError } from '../presentation/errors/invalidParamError'
import { IEmailValidator } from '../presentation/IEmailValidator'


interface ControllerTypes {
  controller: SingUpController
  emailValidatorStub: IEmailValidator
}

const makeController = (): ControllerTypes => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const controller = new SingUpController(emailValidatorStub)

  return {
    controller,
    emailValidatorStub
  }
}

describe('SingUpController', () => {
  test('Should return 400 if no email is provided', () => {
    const { controller } = makeController()
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
    const { controller } = makeController()
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

  test('Should return 400 if an invalid email is provided', () => {
    const { controller, emailValidatorStub } = makeController()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResquest = {
      body: {
        displayName: 'Fulano de Tal',
        email: 'invalid_oneemail@email.com',
        password: 'one_password'
      }
    }
    const httpResponse = controller.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError('email'))
  })
})
