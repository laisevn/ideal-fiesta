import { MissingParamsError, ServerError, InvalidParamsError, InvalidPasswordError } from '../presentation/errors'
import { SingUpController } from './singup'
import { IEmailValidator, IPasswordValidator } from '../presentation/protocols'
import { IAddAccount } from '../domain/usecases/IAddAcount'
import { IAddAccountModel } from '../domain/usecases/IAddAccountModel'
import { IAccountModel } from '../domain/models/IAccountModel'

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
    async add (account: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        displayName: 'Fulano de Tal',
        email: 'invalid_oneemail@email.com',
        password: 'valid_password',
        image: 'valid_url'
      }
      return new Promise(resolve=> resolve(fakeAccount))
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
  test('Should return 400 if no email is provided', async () => {
    const { controller } = makeController()
    const httpResquest = {
      body: {
        displayName: 'Fulano de Tal',
        image: 'https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        password: 'one_password'
      }
    }
    const httpResponse = await controller.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { controller } = makeController()
    const httpResquest = {
      body: {
        displayName: 'Fulano de Tal',
        image: 'https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        email: 'oneemail@email.com'
      }
    }
    const httpResponse = await controller.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
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
    const httpResponse = await controller.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError('email'))
  })

  test('Should call EmailValidator with correct email', async () => {
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

    await controller.handle(httpResquest)
    expect(isValidSpy).toHaveBeenCalledWith('oneemail@email.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    class EmailValidatorStub implements IEmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const passwordValidatorStub = makeController().passwordValidatorStub
    const emailValidatorStub = new EmailValidatorStub()
    const addAccountStub = makeController().addAccountStub
    const controller = new SingUpController(emailValidatorStub, passwordValidatorStub, addAccountStub)

    const httpResquest = {
      body: {
        displayName: 'Fulano de Tal',
        email: 'invalid_oneemail@email.com',
        image: 'https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        password: 'one_password'
      }
    }
    const httpResponse = await controller.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 400 if password is invalid', async () => {
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
    const httpResponse = await controller.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidPasswordError('password'))
  })

  test('Should call AddAccount with correct values', async () => {
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
    await controller.handle(httpResquest)
    expect(addSpy).toBeCalledWith({
      displayName: 'Fulano de Tal',
      email: 'invalid_oneemail@email.com',
      password: 'valid_password',
      image: 'valid_url'
    })
  })

  test('Should return 500 if IAddAccount throws', async () => {
    const { controller, addAccountStub } = makeController()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpResquest = {
      body: {
        displayName: 'Fulano de Tal',
        email: 'invalid_oneemail@email.com',
        image: 'https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        password: 'one_password'
      }
    }
    const httpResponse = await controller.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
