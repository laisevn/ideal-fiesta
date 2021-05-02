import { IHttpResponse } from '../presentation/IHttpResponse'
import { IHttpRequest } from '../presentation/IHttpRequest'
import { MissingParamsError } from '../presentation/errors/missingParamsError'
import { badRequest } from '../presentation/helpers/httpHelper'

export class SingUpController {
  handle (httpResquest: IHttpRequest): IHttpResponse {
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (!httpResquest.body[field]) {
        return badRequest(new MissingParamsError(field))
      }
    }
  }
}
