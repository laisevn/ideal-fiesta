import { IHttpResponse, IHttpRequest, IEmailValidator, IController, IPasswordValidator } from '../presentation/protocols'
import { MissingParamsError, ServerError, InvalidParamsError, InvalidPasswordError } from '../presentation/errors'
import { badRequest, serverError } from '../presentation/helpers/httpHelper'
import { Console } from 'node:console'
import { IAddAccount } from '../../domain/usecases/IAddAcount'


export class SingUpController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly passwordValidator: IPasswordValidator
  private readonly addAccount: IAddAccount

  constructor (
    emailValidator: IEmailValidator, passwordValidator: IPasswordValidator,
    addAccount: IAddAccount
  ) {
    this.emailValidator = emailValidator
    this.passwordValidator = passwordValidator
    this.addAccount = addAccount
  }

  handle (httpResquest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpResquest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }
      const { displayName, email, password, image } = httpResquest.body
      const isValidEmail = this.emailValidator.isValid(email)

      const isValidPassword = this.passwordValidator.isValid(password)

      if (!isValidPassword) {
        return badRequest(new InvalidPasswordError('password'))
      }

      if (!isValidEmail) {
        return badRequest(new InvalidParamsError('email'))
      }

      this.addAccount.add({
        displayName,
        email,
        password,
        image
      })
    } catch (error) {
      return serverError()
    }
  }
}
