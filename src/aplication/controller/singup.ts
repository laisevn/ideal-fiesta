import { IHttpResponse, IHttpRequest, IEmailValidator, IController } from '../presentation/protocols'
import { MissingParamsError, ServerError, InvalidParamsError } from '../presentation/errors'
import { badRequest, serverError } from '../presentation/helpers/httpHelper'
import { Console } from 'node:console'

export class SingUpController implements IController {
  private readonly emailValidator: IEmailValidator

  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpResquest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpResquest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }

      const isValid = this.emailValidator.isValid(httpResquest.body.email)

      if (!isValid) {
        return badRequest(new InvalidParamsError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
