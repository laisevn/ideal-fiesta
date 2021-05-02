import { MissingParamsError, ServerError, InvalidParamsError} from '../presentation/errors'
import { SingUpController } from './singup'
import { IEmailValidator } from '../presentation/protocols'

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

  test('Should call EmailValidator with correct email', () => {
    const { controller, emailValidatorStub } = makeController()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpResquest = {
      body: {
        displayName: 'Fulano de Tal',
        email: 'oneemail@email.com',
        password: 'one_password'
      }
    }

    controller.handle(httpResquest)
    expect(isValidSpy).toHaveBeenCalledWith('oneemail@email.com')
  })

  test('Should return 500 if EmailValidator throws', () => {
    class EmailValidatorStub implements IEmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const controller = new SingUpController(emailValidatorStub)

    const httpResquest = {
      body: {
        displayName: 'Fulano de Tal',
        email: 'invalid_oneemail@email.com',
        password: 'one_password'
      }
    }
    const httpResponse = controller.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
