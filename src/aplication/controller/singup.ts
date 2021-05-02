import { IHttpResponse } from '../presentation/IHttpResponse'
import { IHttpRequest } from '../presentation/IHttpRequest'

export class SingUpController {
  handle (httpResquest: IHttpRequest): IHttpResponse {
    if (!httpResquest.body.email) {
      return {
        statusCode: 400,
        body: new Error('email is required')
      }
    }

    if (!httpResquest.body.password) {
      return {
        statusCode: 400,
        body: new Error('password is required')
      }
    }
  }
}
