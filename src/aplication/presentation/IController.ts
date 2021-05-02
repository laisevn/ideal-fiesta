import { IHttpRequest } from '../presentation/IHttpRequest'
import { IHttpResponse } from '../presentation/IHttpResponse'

export interface IController {
  handle: (httpResquest: IHttpRequest) => IHttpResponse
}
