import { UnauthorizedError } from '../errors'
import { ServerError } from '../errors/serverError'
import { IHttpResponse } from '../protocols'

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error.message
})
export const serverError = (): any => ({
  statusCode: 500,
  body: new ServerError()
})

export const unauthorized = (): IHttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const okResponse = (data: any): IHttpResponse => ({
  statusCode: 200,
  body: data
})