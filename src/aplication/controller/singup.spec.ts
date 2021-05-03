import { MissingParamsError, ServerError, InvalidParamsError, InvalidPasswordError } from '../presentation/errors'
import { SingUpController } from './singup'
import { IEmailValidator, IPasswordValidator } from '../presentation/protocols'
import { IAddAccount } from '../../domain/usecases/IAddAcount'
import { IAddAccountModel } from '../../domain/usecases/IAddAccountModel'
import { IAccountModel } from '../../domain/models/IAccountModel'

interface ControllerTypes {
  controller: SingUpController
  emailValidatorStub: IEmailValidator
  passwordValidatorStub: IPasswordValidator,  
  addAccountStub: IAddAccount
}

const makeController = (): ControllerTypes => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  class PasswordValidatorStub implements IPasswordValidator {
    isValid (password: string): boolean {
      return true
    }
  }
  class AddAccountStub implements IAddAccount {
    add (account: IAddAccountModel): IAccountModel {
      const fakeAccount = {
        id: 'valid_id',
        displayName: 'Fulano de Tal',
        email: 'invalid_oneemail@email.com',
        password: 'valid_password',
        image: 'valid_url'
      }
    }
  }
  const passwordValidatorStub = new PasswordValidatorStub()
  const emailValidatorStub = new EmailValidatorStub()
  const addAccountStub = new AddAccountStub()
  const controller = new SingUpController(emailValidatorStub, passwordValidatorStub, addAccountStub)

  return {
    controller,
    emailValidatorStub,
    passwordValidatorStub,
    addAccountStub
  }
}

describe('SingUpController', () => {
  test('Should return 400 if no email is provided', () => {
    const { controller } = makeController()
    const httpResquest = {
      body: {
        displayName: 'Fulano de Tal',
        image: 'https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
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
        image: 'https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
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
        image: 'https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
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
        image: 'https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
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
        image: 'https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        password: 'one_password'
      }
    }
    const httpResponse = controller.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 400 if password is invalid', () => {
    const { controller, passwordValidatorStub } = makeController()
    jest.spyOn(passwordValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResquest = {
      body: {
        displayName: 'Fulano de Tal',
        email: 'invalid_oneemail@email.com',
        image: 'https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        password: 'short_password'
      }
    }
    const httpResponse = controller.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidPasswordError('password'))
  })

  test('Should call AddAccount with correct values', () => {
    const { controller, addAccountStub } = makeController()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpResquest = {
      body: {
        displayName: 'Fulano de Tal',
        email: 'invalid_oneemail@email.com',
        password: 'valid_password',
        image: 'valid_url'
      }
    }
    controller.handle(httpResquest)
    expect(addSpy).toBeCalledWith({
      displayName: 'Fulano de Tal',
      email: 'invalid_oneemail@email.com',
      password: 'valid_password',
      image: 'valid_url'
    })
  })

  test('Should return 500 if IAddAccount throws', () => {
    const { controller, addAccountStub } = makeController()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResquest = {
      body: {
        displayName: 'Fulano de Tal',
        email: 'invalid_oneemail@email.com',
        image: 'https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        password: 'one_password'
      }
    }
    const httpResponse = controller.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
