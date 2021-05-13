import { IAuthentication } from '../domain/usecases/IAuthentication'
import { MissingParamsError } from '../presentation/errors'
import { badRequest, serverError, unauthorized, okResponse } from '../presentation/helpers/httpHelper'
import { IController, IEmailValidator, IHttpRequest, IHttpResponse } from '../presentation/protocols'

export class LoginController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly authentication: IAuthentication

  constructor (emailValidator: IEmailValidator, authentication: IAuthentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpResquest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpResquest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }
      const { email, password } = httpResquest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new MissingParamsError('email'))
      }
      const token = await this.authentication.auth(email, password)
      if (!token) {
        return unauthorized()
      }
      return okResponse({token})
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
