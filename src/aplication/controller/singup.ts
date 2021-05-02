import { IHttpResponse } from '../presentation/IHttpResponse'
import { IHttpRequest } from '../presentation/IHttpRequest'
import { MissingParamsError } from '../presentation/errors/missingParamsError'
import { badRequest } from '../presentation/helpers/httpHelper'
import { IController } from '../presentation/IController'
import { IEmailValidator } from '../presentation/IEmailValidator'
import { InvalidParamsError } from '../presentation/errors/invalidParamError'

export class SingUpController implements IController {
  private readonly emailValidator: IEmailValidator

  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpResquest: IHttpRequest): IHttpResponse {
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
  }
}
