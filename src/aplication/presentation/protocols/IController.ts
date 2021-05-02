import { IHttpRequest, IHttpResponse } from '../protocols'

export interface IController {
  handle: (httpResquest: IHttpRequest) => IHttpResponse
}
