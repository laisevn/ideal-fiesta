import { ServerError } from '../errors/serverError'
import { IHttpResponse } from '../protocols'

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = () => ({
  statusCode: 500,
  body: new ServerError()
})

export const okResponse = (data: any): IHttpResponse => ({
  statusCode: 200,
  body: data
})