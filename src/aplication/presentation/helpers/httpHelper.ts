import { IHttpResponse } from '../IHttpResponse'

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error
})