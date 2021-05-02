import { IHttpResponse } from '../presentation/IHttpResponse'
import { IHttpRequest } from '../presentation/IHttpRequest'
import { MissingParamsError } from '../presentation/errors/missingParamsError'

export class SingUpController {
  handle (httpResquest: IHttpRequest): IHttpResponse {
    if (!httpResquest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamsError('email')
      }
    }

    if (!httpResquest.body.password) {
      return {
        statusCode: 400,
        body: new MissingParamsError('password')
      }
    }
  }
}
