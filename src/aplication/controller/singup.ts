import { IHttpResponse } from '../presentation/IHttpResponse'
import { IHttpRequest } from '../presentation/IHttpRequest'
import { MissingParamsError } from '../presentation/errors/missingParamsError'
import { badRequest } from '../presentation/helpers/httpHelper'

export class SingUpController {
  handle (httpResquest: IHttpRequest): IHttpResponse {
    if (!httpResquest.body.email) {
      return badRequest(new MissingParamsError('email'))
    }

    if (!httpResquest.body.password) {
      return badRequest(new MissingParamsError('password'))
    }
  }
}
