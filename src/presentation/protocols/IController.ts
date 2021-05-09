import { IHttpRequest, IHttpResponse } from '.'

export interface IController {
  handle: (httpResquest: IHttpRequest) => Promise<IHttpResponse>
}
