import { IHttpResponse, IHttpRequest, IEmailValidator, IController, IPasswordValidator } from '../presentation/protocols'
import { MissingParamsError, InvalidParamsError, InvalidPasswordError } from '../presentation/errors'
import { badRequest, serverError, okResponse } from '../presentation/helpers/httpHelper'
import { IAddAccount } from '../domain/usecases/IAddAcount'

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

  async handle (httpResquest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpResquest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }
      const { displayName, email, password, image } = httpResquest.body
      const isValidEmail = this.emailValidator.isValid(email)

      const isValidPassword = this.passwordValidator.isMinLenght(password)

      if (!isValidPassword) {
        return badRequest(new InvalidPasswordError('password'))
      }

      if (!isValidEmail) {
        return badRequest(new InvalidParamsError('email'))
      }

      const account = await this.addAccount.add({
        displayName,
        email,
        password,
        image
      })
      return okResponse(account)
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}
