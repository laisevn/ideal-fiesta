import { IHttpResponse, IHttpRequest, IEmailValidator, IController, IPasswordValidator } from '../presentation/protocols'
import { MissingParamsError, ServerError, InvalidParamsError, InvalidPasswordError } from '../presentation/errors'
import { badRequest, serverError } from '../presentation/helpers/httpHelper'
import { Console } from 'node:console'

export class SingUpController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly passwordValidator: IPasswordValidator

  constructor (emailValidator: IEmailValidator, passwordValidator: IPasswordValidator) {
    this.emailValidator = emailValidator
    this.passwordValidator = passwordValidator
  }

  handle (httpResquest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpResquest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }
      const { email, password } = httpResquest.body
      const isValidEmail = this.emailValidator.isValid(email)

      const isValidPassword = this.passwordValidator.isValid(password)

      if (!isValidPassword) {
        return badRequest(new InvalidPasswordError('password'))
      }

      if (!isValidEmail) {
        return badRequest(new InvalidParamsError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
