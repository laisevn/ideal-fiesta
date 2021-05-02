import { ServerError } from '../errors/serverError'
import { IHttpResponse } from '../IHttpResponse'

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = () => ({
  statusCode: 500,
  body: new ServerError()
})
